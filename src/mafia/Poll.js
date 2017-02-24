import { LANG } from './settings/gameSettings'
import { sleep } from './utils'
import PollStrings from './strings/poll'
import async from 'async'
import _ from 'lodash'

const str = new PollStrings(LANG)

export default class Poll {
  constructor(game, chan, text, choices, showResult = false, ignoreId = false) {
    this.game = game
    this.chan = chan
    this.text = text
    this.choices = choices
    this.poll = []
    this.pollResults = {}
    this.validatedPollResults = {}
    this.showResult = showResult
    this.ignoreId = ignoreId
  }

  start() {
    this.game.postMessage(this.chan, this.text)
      .then(() => {
        async.forEachSeries(this.choices, (choice, callback) => {
          this.game.postMessage(this.chan, '• ' + choice.name)
            .then((response) => {
              this.poll.push(response.response)
              callback()
            })
        })
      })
  }

  // end the poll in 5 seconds, get results then resolve true
  end() {
    return new Promise((resolve, reject) => {
      this.game.postMessage(this.chan, str.remaining())
        .then(() => sleep(6))
        .then(() => this.resolve())
        .then(() => this.game.postMessage(this.chan, this.showResult ? this.validateToString() : str.ended()))
        .then(() => resolve(true))
    })
  }

  // get players vote for each choice then pass votes to validation
  resolve() {
    return new Promise((resolve, reject) => {
      if (this.poll.length > 0) {
        async.forEachOf(this.poll, (p, k, callback) => {
          // removing the bullet points with slice
          this.pollResults[(p.message.text)
            .slice(2)] = []
          this.game.slackApi.api('reactions.get', {
            channel: p.channel,
            timestamp: p.ts
          }, (err, response) => {
            _.forEach(response.message.reactions, r => {
              this.pollResults[(p.message.text)
                .slice(2)].push(_.uniq(r.users))
            })
            callback()
          })
        }, () => resolve(this.validate()))
      }
    })
  }


  validate() {
    // this is the validated poll
    let resPoll = {}
    // for each choices, flatten the arrays of voters
    _.forEach(this.pollResults, (voters, choice) => {
      this.pollResults[choice] = _.flattenDeep(voters)
      // initialize keys
      resPoll[choice] = []
    })
    // get unique voters from the poll
    var voters = _.uniq(_.flattenDeep(_.values(this.pollResults)))
    // remove vote from ignore players
    if (this.ignoreId) {
      _.remove(voters, v => v == this.ignoreId)
    }
    _.forEach(voters, v => {
      // check if players is alive
      if (_.find(this.game.getPlayers(), { id: v })) {
        // for each choice
        _.forEach(this.pollResults, (value, key) => {
          // if player has voted
          if (_.indexOf(value, v) > -1) {
            resPoll[key].push(v)
            // break for lodash forEach
            return false
          }
        })
      }
    })
    this.validatedPollResults = resPoll
    return true
  }

  getMaxVoted() {
    let targets = []
    let res = _.reduce(this.validatedPollResults, (result, value, key) => {
      result[key] = value.length;
      return result
    }, {})
    let maxVote = _.max(_.values(res))
    _.forEach(res, (value, key) => {
      if (value == maxVote) {
        targets.push(key)
      }
    })
    res = {
      maxVote: maxVote,
      targets: targets
    }
    return res
  }

  validateToString() {
    let text = str.ended()
    _.forOwn(this.validatedPollResults, (value, key) => {
      if (value.length > 0) {
        text += '*' + key + '* :arrow_right: '
        _.forEach(value, v => {
          text += _.find(this.game.players, { id: v })
            .name + ' '
        })
        text += '\n'
      }
    })
    return text
  }
}
