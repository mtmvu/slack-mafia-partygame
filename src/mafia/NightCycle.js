import { MAFIA_LYNCH, LANG } from './settings/gameSettings'
import Poll from './Poll'
import { sleep } from './utils'
import NightCycleStrings from './strings/nightCycle'
import miscStrings from './strings/misc'
import _ from 'lodash'
import async from 'async'

const str = new NightCycleStrings(LANG)
const { crimes } = miscStrings[LANG]

export default class NightCycle {
  constructor(game) {
    this.game = game
    this.events = []
    this.kills = []
    this.state
  }

  // Anonunce night cycle
  // Start poll for mafia players
  // Activate night abilities for all players
  start() {
    const chan = this.game.getTownRoom()
    this.game.postMessage(chan, str.start())
    this.game.gameEmitter.on('nightEvent', (data) => this.newNightEvent(data))
    this.startMafiaPoll()
    _.forEach(this.game.getPlayers(), player => {
      player.activateNightAbility()
    })
  }

  // Announce end of night
  end() {
    sleep(10)
      .then(() => {
        this.game.gameEmitter.removeAllListeners('nightEvent')
        this.game.gameEmitter.emit('newCycle', 'day')
      })
  }

  newNightEvent(data) {
    this.events.push(data)
  }

  // Resolve all nights events if the following order:
  // 1. Players receives protections points from doctor, bodyguard, etc
  // 2. Veterans becomes invulnerable and emit a kill event for every player who visits them
  // 3. Bodyguard emits a kill event if someone tries to kill their target
  // 4. Check for each player if they can die then push the event to kills array
  // 5. Resolve investigations roles
  resolveEvents() {
    const chan = this.game.getTownRoom()
    const text = str.end()
    this.game.postMessage(chan, text)
      .then(() => this.resolveBlocks())
      .then(() => this.resolveProtections())
      .then(() => this.resolveKillings())
      .then(() => this.resolveVeterans())
      .then(() => this.resolveBodyguards())
      .then(() => this.resolveKills())
      .then(() => this.resolveFakers())
      .then(() => this.resolveInvestigations())
      .then(() => this.end())
  }

  resolveBlocks() {
    return new Promise((resolve, reject) => {
      const blockers = ['Escort', 'Consort']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(blockers, player.role.name) > -1) {
          player.resolveNightAbility()
            .then(() => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  resolveProtections() {
    return new Promise((resolve, reject) => {
      const protections = ['Doctor', 'Survivor']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(protections, player.role.name) > -1) {
          player.resolveNightAbility()
            .then(() => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  resolveKillings() {
    return new Promise((resolve, reject) => {
      const killings = ['Arsonist', 'SerialKiller', 'Vigilante', 'Mafioso', 'Godfather']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(killings, player.role.name) > -1) {
          player.resolveNightAbility()
            .then(() => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  resolveVeterans() {
    return new Promise((resolve, reject) => {
      const veterans = ['Veteran']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(veterans, player.role.name) > -1) {
          player.resolveNightAbility(this.events)
            .then(() => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  resolveBodyguards() {
    return new Promise((resolve, reject) => {
      const bodyguards = ['Bodyguard']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(bodyguards, player.role.name) > -1) {
          player.resolveNightAbility(this.events)
            .then(events => {
              if (events) { this.events = events }
              callback()
            })
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  resolveKills() {
    return new Promise((resolve, reject) => {
      _.forEach(_.filter(this.events, { type: 'kill' }), event => {
        const killer = _.find(this.game.players, { name: event.player })
        const target = _.find(this.game.players, { name: event.target })
        if (target.hasNightImmunity) {
          if (killer.ignoreNightImmunity) {
            this.kills.push(event)
            killer.addCrime(crimes.murder)
          } else {
            this.game.postMessage(killer.id, str.resolve('immune'))
          }
          // ignoreNightImmunity = instakill
        } else if (killer.ignoreNightImmunity) {
          this.kills.push(event)
          killer.addCrime(crimes.murder)

        } else {
          if (--target.protections < 0) {
            this.kills.push(event)
            killer.addCrime(crimes.murder)
          }
        }

        // alert doctor
        const saves = _.filter(this.events, { type: 'doctor', target: target.name })
        if (saves.length > 0) {
          _.forEach(saves, save => {
            const doctor = _.find(this.game.players, { name: save.player })
            this.game.postMessage(doctor.id, str.resolve('doctor'))
          })
        }
      })
      resolve(true)
    })
  }

  resolveFakers() {
    return new Promise((resolve, reject) => {
      const fakers = ['Framer', 'Janitor']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(fakers, player.role.name) > -1) {
          player.resolveNightAbility()
            .then(() => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  resolveInvestigations() {
    return new Promise((resolve, reject) => {
      const investigations = ['Consigliere', 'Cop', 'Investigator', 'Lookout', 'Tracker']
      async.forEach(this.game.getPlayers(), (player, callback) => {
        if (_.indexOf(investigations, player.role.name) > -1) {
          player.resolveNightAbility(this.events)
            .then(() => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  // Mafia players choose a target for the night
  startMafiaPoll() {
    const chan = this.game.getMafiaRoom()
    const text = str.startMafia()
    const choices = this.game.getPlayers()
    let poll = new Poll(this.game, chan, text, choices)
    poll.start()
    sleep(MAFIA_LYNCH)
      .then(() => poll.end())
      .then(() => this.endMafiaPoll(poll))
  }

  // When the poll ends, call 'resolveEvents'
  endMafiaPoll(poll) {
    const chan = this.game.getMafiaRoom()
    const resPoll = poll.getMaxVoted()
    let text
    if (resPoll.maxVote > 0) {
      const killers = this.game.getPlayers({ filters: { affiliation: 'Mafia', category: 'Mafia Killing' } })
      if (killers.length == 0) {
        text = str.endMafia('noKiller')
      } else {
        const killer = _.sample(killers)
        const target = _.find(this.game.players, { name: resPoll.targets[0] })
        killer.addCrime(crimes.trespassing)
        killer.poll = poll
        this.game.gameEmitter.emit('nightEvent', {
          type: 'visit',
          player: killer.name,
          target: target.name
        })
        text = str.endMafia('kill', { killer: killer.name, target: target.name })
      }
    } else {
      text = str.endMafia('noKill')
    }
    this.game.postMessage(chan, text)
      .then(() => sleep(2))
      .then(() => this.resolveEvents())
  }
}
