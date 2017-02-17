import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import DoctorStrings from '../strings/roles/doctor'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new DoctorStrings(LANG)
const misc = miscStrings[LANG]

let doctor = {
  name: 'Doctor',
  affiliation: 'Town',
  category: 'Town Protective',
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

  // Create a poll to save for a player
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

  //
  resolveNightAbility(player) {
    return new Promise((resolve, reject) => {
      const resPoll = player.poll.getMaxVoted()
      let text
      if (resPoll.maxVote > 0) {
        const target = _.find(player.game.players, { name: resPoll.targets[0] })
        text = str.resolveNightAbility('protection', target.name)
        player.game.gameEmitter.emit('nightEvent', {
          type: 'doctor',
          player: player.name,
          target: target.name
        })
        target.protections += 1
      } else {
        text = str.resolveNightAbility('noProtection')
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

export default doctor
