import { LANG } from '../settings/gameSettings'
import MafiosoStrings from '../strings/roles/mafioso'
import miscStrings from '../strings/misc'
import _ from 'lodash'

const str = new MafiosoStrings(LANG)
const misc = miscStrings[LANG]

let mafioso = {
  name: 'Mafioso',
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
    isUnique: false,
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

export default mafioso
