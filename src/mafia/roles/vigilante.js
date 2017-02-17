import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import VigilanteStrings from '../strings/roles/vigilante'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new VigilanteStrings(LANG)
const misc = miscStrings[LANG]

let vigilante = {
  name: 'Vigilante',
  affiliation: 'Town',
  category: 'Town Killing',
  desc: {
    name: str.desc('name'),
    particle: str.desc('particle'),
    summary: str.desc('summary'),
    goal: str.desc('goal'),
    nightAbility: str.desc('nightAbility')
  },
  params: {
    isUnique: false,
    investigationCop: misc.investigation.innocent,
    nightAbilityCounter: 2
  },

  activatePreNightAbility(player, game) {

  },

  activateNightAbility(player) {
    if ((player.role.params.nightAbilityCounter > 0) && (player.game.gameState.nightCount <= 1)) {
      const chan = player.id
      const text = str.activateNightAbility()
      const choices = player.game.getPlayers({ except: player.name })
      let poll = new Poll(player.game, chan, text, choices)
      poll.start()
      sleep(NIGHT_ACTIVITY)
        .then(() => poll.end())
        .then(() => player.poll = poll)
        .then(() => player.visit())
    } else {
      player.poll = false
    }
  },

  resolveNightAbility(player, events) {
    return new Promise((resolve, reject) => {
      if (player.poll) {
        const resPoll = player.poll.getMaxVoted()
        let text
        if (resPoll.maxVote > 0) {
          const target = _.find(player.game.players, { name: resPoll.targets[0] })
          text = str.resolveNightAbility('kill', target.name)
          player.game.gameEmitter.emit('nightEvent', {
            type: 'kill',
            player: player.name,
            target: target.name,
            killType: 'vigilante'
          })
          player.role.params.nightAbilityCounter -= 1
        } else {
          text = str.resolveNightAbility('noKill')
        }
        player.game.postMessage(player.id, text)
          .then(() => resolve(true))
      } else {
        resolve(true)
      }
    })
  },

  visit(player) {
    if (player.poll) {
      return new Promise((resolve, reject) => {
        const resPoll = player.poll.getMaxVoted()
        if (resPoll.maxVote > 0) {
          const target = _.find(player.game.players, { name: resPoll.targets[0] })
          player.game.gameEmitter.emit('nightEvent', {
            type: 'visit',
            player: player.name,
            target: target.name
          })
          player.addCrime(misc.crimes.trespassing)
        }
        resolve(true)
      })
    } else {
      return new Promise((resolve, reject) => resolve(true))
    }
  }
}

export default vigilante
