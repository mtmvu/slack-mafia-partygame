import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import VeteranStrings from '../strings/roles/veteran'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new VeteranStrings(LANG)
const misc = miscStrings[LANG]

let veteran = {
  name: 'Veteran',
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
    nightAbilityCounter: 2,
    immuneToRoleBlock: true
  },

  activatePreNightAbility(player, game) {

  },

  activateNightAbility(player) {
    if (player.role.params.nightAbilityCounter > 0) {
      const chan = player.id
      const text = str.activateNightAbility()
      const choices = [
        {
          name: misc.yes
        },
        {
          name: misc.no
        }]
      let poll = new Poll(player.game, chan, text, choices)
      poll.start()
      sleep(NIGHT_ACTIVITY)
        .then(() => poll.end())
        .then(() => player.poll = poll)
    } else {
      player.poll = false
    }
  },

  resolveNightAbility(player, events) {
    return new Promise((resolve, reject) => {
      if (player.poll) {
        const resPoll = player.poll.getMaxVoted()
        if (resPoll.maxVote > 0) {
          const result = _.sample(resPoll.targets)
          if (result == misc.yes) {
            const text = str.resolveNightAbility()
            player.hasNightImmunity = true
            player.role.params.nightAbilityCounter -= 1
            player.game.postMessage(player.id, text)
              .then(() => {
                _.forEach(_.filter(events, { type: 'visit', target: player.name }), visit => {
                  player.game.gameEmitter.emit('nightEvent', {
                    type: 'kill',
                    player: player.name,
                    target: visit.player,
                    killType: 'veteran'
                  })
                })
                resolve(true)
              })
          }
        } else {
          resolve(true)
        }
      } else {
        resolve(true)
      }
    })
  },

  visit() {}
}

export default veteran
