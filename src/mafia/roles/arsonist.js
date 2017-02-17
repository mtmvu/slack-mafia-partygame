import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import ArsonistStrings from '../strings/roles/arsonist'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new ArsonistStrings(LANG)
const misc = miscStrings[LANG]

let arsonist = {
  name: 'Arsonist',
  affiliation: 'Neutral',
  category: 'Neutral Killing',
  desc: {
    name: str.desc('name'),
    particle: str.desc('particle'),
    summary: str.desc('summary'),
    goal: str.desc('goal'),
    nightAbility: str.desc('nightAbility')
  },
  params: {
    isUnique: false,
    investigationCop: misc.investigation.arsonist,
    hasNightImmunity: true,
    ignoreNightImmunity: true
  },

  activatePreNightAbility() {

  },

  activateNightAbility(player) {
    const chan = player.id
    const text = str.activateNightAbility()
    const choices = _.filter(player.game.getPlayers({ except: player.name }), { isDoused: false })
    choices.push({ name: str.burn() })
    let poll = new Poll(player.game, chan, text, choices)
    poll.start()
    sleep(NIGHT_ACTIVITY)
      .then(() => poll.end())
      .then(() => player.poll = poll)
      .then(() => player.visit())
  },

  resolveNightAbility(player) {
    return new Promise((resolve, reject) => {
      const resPoll = player.poll.getMaxVoted()
      let text
      if (resPoll.maxVote > 0) {
        if (resPoll.targets[0] == str.burn()) {
          _.forEach(_.filter(player.game.getPlayers({ except: player.name }), { isDoused: false }), target => {
            player.game.gameEmitter.emit('nightEvent', {
              type: 'kill',
              player: player.name,
              target: target.name,
              typeKill: 'arsonist'
            })
            player.addCrime(misc.crimes.arson)
          })
          text = str.resolveNightAbility('burn')
        } else {
          const target = _.find(player.game.players, { name: resPoll.targets[0] })
          text = str.resolveNightAbility('douse', target.name)
          target.isDoused = true
          player.game.postMessage(target.id, str.resolveNightAbility('doused'))
        }
      } else {
        text = str.resolveNightAbility('noDouse')
      }
      player.game.postMessage(player.id, text)
        .then(() => resolve(true))
    })
  },

  visit(player) {
    return new Promise((resolve, reject) => {
      const resPoll = player.poll.getMaxVoted()
      if (resPoll.maxVote > 0) {
        if (resPoll.targets[0] != str.burn()) {
          const target = _.find(player.game.players, { name: resPoll.targets[0] })
          player.game.gameEmitter.emit('nightEvent', {
            type: 'visit',
            player: player.name,
            target: target.name
          })
          player.addCrime(misc.crimes.trespassing)
        }
      }
      resolve(true)
    })
  }
}

export default arsonist
