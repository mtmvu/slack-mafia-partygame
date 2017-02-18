import {
  DAY_DEBATE,
  DAY_DEBATE_POLL,
  DAY_TRIAL,
  DAY_TRIAL_POLL,
  LANG
}
from './settings/gameSettings'
import Poll from './Poll'
import { sleep } from './utils'
import DayCycleStrings from './strings/dayCycle'
import miscStrings from './strings/misc'
import _ from 'lodash'
import async from 'async'

const str = new DayCycleStrings(LANG)
const misc = miscStrings[LANG]

export default class DayCycle {
  constructor(game) {
    this.game = game
    this.lastNightKills = _.last(game.gameState.cycles)
      .kills
    this.maxTrial = 2
    this.kills = []
    this.state
  }

  // Announce day cycle
  // Reset attributes
  // Announce dead players during previous night
  // Show graveyard and remaining players
  // Check for win
  // If win then end game
  // Else start debate poll
  start() {
    const chan = this.game.getTownRoom()
    this.game.postMessage(chan, str.start('start'))
      .then(() => {
        this.game.resetImmunity()
        this.game.resetProtections()
        this.game.resetRoleBlock()
        this.game.resetFramed()
        this.makeAnnouncements()
          .then(() => this.game.showGraveyard(chan))
          .then(() => this.game.resetCleaned())
          .then(() => this.game.showAlive(chan))
          .then(() => {
            const hasWon = this.game.checkVictory()
            if (hasWon) {
              this.game.resolveVictory(hasWon)
            } else {
              this.game.updateMafiaRoles()
                .then(() => this.game.postMessage(chan, str.start('debate')))
                .then(() => sleep(DAY_DEBATE))
                .then(() => this.startDebatePoll())
            }
          })
      })
  }

  // Check for win
  // Else emit new night cycle
  end() {
    const hasWon = this.game.checkVictory()
    if (hasWon) {
      this.game.resolveVictory(hasWon)
    } else {
      this.game.updateMafiaRoles()
        .then(() =>
          this.game.postMessage(this.game.getTownRoom(), str.end()))
        .then(() => sleep(10))
        .then(() => this.game.gameEmitter.emit('newCycle', 'night'))
    }
  }

  // Players choose their suspects
  startDebatePoll() {
    const chan = this.game.getTownRoom()
    const text = str.startDebate()
    const choices = this.game.getPlayers()
    const poll = new Poll(this.game, chan, text, choices, true)
    poll.start()
    sleep(DAY_DEBATE_POLL)
      .then(() => poll.end())
      .then(() => this.endDebatePoll(poll))
  }

  // Get the most suspected player then put him to trial and mute rest of town.
  // Unmute town after a while then start lynch poll
  // If no vote call end()
  endDebatePoll(poll) {
    const chan = this.game.getTownRoom()
    const resPoll = poll.getMaxVoted()
    if (resPoll.maxVote > 0) {
      // if multiple suspects, take randomly
      let suspect = _.sample(resPoll.targets)
      suspect = _.find(this.game.players, {
        name: suspect
      })
      const text = str.endDebate('trial', { name: suspect.name, time: String(DAY_TRIAL) })
      this.game.postMessage(chan, text)
        .then(() => {
          const muted = _.filter(this.game.getPlayers(), (o) => o.id != suspect.id)
          this.game.mute(muted)
          sleep(DAY_TRIAL)
            .then(() => {
              this.game.unmute(muted)
              this.startTrialPoll(suspect.id)
            })
        })
    } else {
      const text = str.endDebate('noVote')
      this.game.postMessage(chan, text)
        .then(() => sleep(5))
        .then(() => this.end())
    }
  }

  // Yes/No poll to lynch player
  startTrialPoll(playerId) {
    const chan = this.game.getTownRoom()
    const text = str.startTrial()
    const choices = [
      {
        name: misc.yes
      },
      {
        name: misc.no
      }]
    const poll = new Poll(this.game, chan, text, choices, true)
    poll.start()
    sleep(DAY_TRIAL_POLL)
      .then(() => poll.end())
      .then(() => this.endTrialPoll(poll, playerId))
  }

  // If equality in yes/no then take random
  // If yes then lynch player
  // Else restart a poll to find a new suspect
  // If no vote then call end()
  endTrialPoll(poll, playerId) {
    const chan = this.game.getTownRoom()
    const resPoll = poll.getMaxVoted()
    const suspect = _.find(this.game.getPlayers(), { id: playerId })
    const result = _.sample(resPoll.targets)
    let text = ''

    if (resPoll.maxVote > 0) {
      if (resPoll.targets.length > 1) {
        text = str.endTrial('draw')
        this.game.postMessage(chan, text)
          .then(() => sleep(3))
          .then(() => {
            if (Math.random() > 0.5) {
              this.game.postMessage(chan, str.endTrial('die'))
                .then(() => {
                  this.kills.push({ type: 'kill', player: 'Town', target: suspect.name, killType: 'lynch' })
                  this.game.newVictim(suspect, 'lynch')
                    .then(() => this.end())
                })
            } else {
              text = str.endTrial('live')
              this.game.postMessage(chan, text)
                .then(() => this.restartDebate())
            }
          })
      } else if (result == misc.yes) {
        this.game.postMessage(chan, str.endTrial('lynch', suspect.name))
          .then(() => {
            this.kills.push({ type: 'kill', player: 'Town', target: suspect.name, killType: 'lynch' })
            this.game.newVictim(suspect, 'lynch')
              .then(() => this.end())
          })

      } else {
        text = str.endTrial.innocent + ' ' + suspect.name + ' :innocent:'
        this.game.postMessage(chan, text)
          .then(() => this.restartDebate())
      }
    } else {
      text = str.endTrial('noVote')
      this.game.postMessage(chan, text)
        .then(() => this.end())

    }
  }

  // If it's possible, restart a poll to find a suspect
  restartDebate() {
    const chan = this.game.getTownRoom()
    if (--this.maxTrial > 0) {
      this.game.postMessage(chan, str.restartDebate(true))
        .then(() => this.startDebatePoll())
    } else {
      this.game.postMessage(chan, str.restartDebate(false))
        .then(() => this.end())
    }
  }

  // Start of day announcement's function
  // Show all players dead during the previous night
  makeAnnouncements() {
    return new Promise((resolve, reject) => {
      const nKills = this.lastNightKills.length < 14 ? this.lastNightKills.length : 14
      const chan = this.game.getTownRoom()
      this.game.postMessage(chan, str.announcements(nKills))
        .then(() => {
          async.forEachSeries(this.lastNightKills, (event, callback) => {
            const victim = _.find(this.game.players, {
              name: event.target
            })
            this.game.newVictim(victim, event.killType)
              .then(() => sleep(2))
              .then(() => callback())
          }, () => resolve(true))
        })
    })
  }
}
