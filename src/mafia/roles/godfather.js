import { LANG } from '../settings/gameSettings'
import GodfatherStrings from '../strings/roles/godfather'
import miscStrings from '../strings/misc'
import _ from 'lodash'

const str = new GodfatherStrings(LANG)
const misc = miscStrings[LANG]

let godfather = {
  name: 'Godfather',
  affiliation: 'Mafia',
  category: 'Mafia Killing',
  desc: {
    name: str.desc('name'),
    particle: str.desc('particle'),
    summary: str.desc('summary'),
    goal: str.desc('goal'),
    nightAbility: str.desc('nightAbility')
  },
  params: {
    isUnique: true,
    immuneDetection: true,
    investigationCop: misc.investigation.mafia
  },

  activatePreNightAbility() {

  },

  activateNightAbility() {

  },

  resolveNightAbility(player) {
    return new Promise((resolve, reject) => {
      if (player.poll) {
        const resPoll = player.poll.getMaxVoted()
        const target = _.find(player.game.players, { name: resPoll.targets[0] })
        player.game.gameEmitter.emit('nightEvent', {
          type: 'kill',
          player: player.name,
          target: target.name,
          killType: 'mafia'
        })
      }
      resolve(true)
    })
  },

  visit() {

  }
}

export default godfather
