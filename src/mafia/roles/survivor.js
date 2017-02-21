import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import SurvivorStrings from '../strings/roles/survivor'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new SurvivorStrings(LANG)
const misc = miscStrings[LANG]

let survivor = {
  name: 'Survivor',
  affiliation: 'Neutral',
  category: 'Neutral Benign',
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
    bulletproofVest: 3
  },

  activatePreNightAbility() {

  },

  activateNightAbility(player) {
    if (player.role.params.bulletproofVest > 0) {
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

  resolveNightAbility(player) {
    return new Promise((resolve, reject) => {
      if (player.poll) {
        const resPoll = player.poll.getMaxVoted()
        if (resPoll.maxVote > 0) {
          const result = _.sample(resPoll.targets)
          if (result == misc.yes) {
            const text = str.resolveNightAbility()
            player.protections += 1
            player.role.params.bulletproofVest -= 1
            player.game.postMessage(player.id, text)
              .then(() => resolve(true))
          }
        } else {
          resolve(true)
        }
      } else {
        resolve(true)
      }
    })
  },

  visit() {

  }
}

export default survivor
