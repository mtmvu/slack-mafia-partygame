import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import TrackerStrings from '../strings/roles/tracker'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new TrackerStrings(LANG)
const misc = miscStrings[LANG]

let tracker = {
  name: 'Tracker',
  affiliation: 'Town',
  category: 'Town Investigative',
  desc: {
    name: str.desc('name'),
    particle: str.desc('particle'),
    summary: str.desc('summary'),
    goal: str.desc('goal'),
    nightAbility: str.desc('nightAbility')
  },
  params: {
    isUnique: false,
    investigationCop: misc.investigation.innocent
  },

  activatePreNightAbility(player, game) {

  },

  // Create a poll to look for a player
  activateNightAbility(player) {
    const chan = player.id
    const text = str.activateNightAbility()
    const choices = player.game.getPlayers({ except: player.name })
    let poll = new Poll(player.game, chan, text, choices)
    poll.start()
    sleep(NIGHT_ACTIVITY)
      .then(() => poll.end())
      .then(() => player.poll = poll)
      .then(() => player.visit())
  },

  // display investigation result
  resolveNightAbility(player, events) {
    return new Promise((resolve, reject) => {
      const resPoll = player.poll.getMaxVoted()
      let text = ''
      if (resPoll.maxVote > 0) {
        const target = _.find(player.game.players, { name: resPoll.targets[0] })
        const visits = _.filter(events, { type: 'visit', player: target.name })
        text = str.resolveNightAbility('trackingResult')
        if (visits.length > 0) {
          _.forEach(visits, visit => {
            text += str.resolveNightAbility('hasVisited', { target: target.name, visit: visit.target })
          })
        } else {
          text += str.resolveNightAbility('hasNotVisited', target.name)
        }
      } else {
        text = str.resolveNightAbility('noInvestigation')
      }
      player.game.postMessage(player.id, text)
        .then(() => resolve(true))
    })
  },

  visit(player) {
    return new Promise((resolve, reject) => {
      const resPoll = player.poll.getMaxVoted()
      if (resPoll.maxVote > 0) {
        const target = _.find(player.game.players, { name: resPoll.targets[0] })
        player.game.gameEmitter.emit('nightEvent', {
          type: 'visit',
          player: player.name,
          target: target.name
        })
      }
      resolve(true)
    })
  }
}

export default tracker
