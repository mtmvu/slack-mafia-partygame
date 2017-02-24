import SlackBot from 'slackbots'
import Slack from 'slack-node'
import Game from './Game'
import { GROUPS, CHANNELS } from './settings/gameSettings'
import _ from 'lodash'
import { EventEmitter } from 'events'
import async from 'async'


export default class MafiaGameMaster {
  constructor() {
    this.mafiaPartyGame = null
    this.masterEmitter = new EventEmitter()
    this.bot = new SlackBot({
      token: process.env.MAFIA_API_TOKEN,
      name: process.env.MAFIA_API_NAME
    })
    this.bot.on('start', () => {
      this.slackApi = new Slack(process.env.MAFIA_API_TOKEN)
      this.slackApi.botID = this.bot.self.id
      this.slackApi.botIM = _.find(this.bot.ims, { user: this.bot.self.id })
        .id
      this.botHasStarted = true
      this.listen()
    })
  }

  listen() {
    this.bot.on('message', data => {
      if (data.type == 'message' && data.text) {
        if ((data.text)
          .slice(0, 6) == '!mafia') {
          const command = _.lowerCase(data.text.slice(7))
          this.runCommands(command)
        } else if (data.user != this.slackApi.botID) {
          this.dispatchEvents('message', data)
        }
      }
    })
  }

  runCommands(command) {
    switch (command) {
      case 'newgame':
        this.newGame()
        break
      default:
        this.dispatchEvents('command', command)
    }
  }

  dispatchEvents(category, data) {
    this.masterEmitter.emit(category, data)
  }

  newGame() {
    if (!this.mafiaPartyGame) {
      this.prepareMafiaPartyGame()
        .then((chans) => this.mafiaPartyGame = new MafiaPartyGame(this, chans))

    } else {
      console.log('game already created')
    }
  }

  getChannels() {
    return new Promise((resolve, reject) => {
      this.slackApi.api('channels.list', (err, response) => {
        if (response.ok) {
          resolve(response.channels)
        } else {
          console.log(err)
        }
      })
    })
  }

  getGroups() {
    return new Promise((resolve, reject) => {
      this.slackApi.api('groups.list', (err, response) => {
        if (response.ok) {
          resolve(response.groups)
        } else {
          console.log(err)
        }
      })
    })
  }

  channelKick(channel) {
    return new Promise((resolve, reject) => {
      async.forEach(channel.members, (member, callback) => {
        if (member != this.slackApi.botID) {
          this.slackApi.api('channels.kick', { channel: channel.id, user: member }, () => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }

  groupKick(group) {
    return new Promise((resolve, reject) => {
      async.forEach(group.members, (member, callback) => {
        if (member != this.slackApi.botID) {
          this.slackApi.api('groups.kick', { channel: group.id, user: member }, () => callback())
        } else {
          callback()
        }
      }, () => resolve(true))
    })
  }


  initGameChannels(channels) {
    return new Promise((resolve, reject) => {
      const chans = []
      async.forEach(_.keys(CHANNELS), (chan, callback) => {
        let existingChan = _.find(channels, { name: chan })
        if (existingChan) {
          chans.push({ id: existingChan.id, name: existingChan.name, category: CHANNELS[chan] })
          if (process.env.MAFIA_ENV == 'DEBUG') {
            callback()
          } else {
            this.channelKick(existingChan)
              .then(() => callback())
          }
        } else {
          this.slackApi.api('channels.create', { name: chan }, (err, response) => {
            if (response.ok) {
              chans.push({ id: response.channel.id, name: response.channel.name, category: CHANNELS[chan] })
              callback()
            } else {
              console.log('Creating channel' + chan + ' failed:')
              console.log(response)
            }
          })
        }
      }, () => resolve(chans))
    })
  }

  initGameGroups(groups) {
    return new Promise((resolve, reject) => {
      const chans = []
      async.forEach(_.keys(GROUPS), (group, callback) => {
        let existingGroup = _.find(groups, { name: group })
        if (existingGroup) {
          chans.push({ id: existingGroup.id, name: existingGroup.name, category: GROUPS[group] })
          this.groupKick(existingGroup)
            .then(() => callback())
        } else {
          this.slackApi.api('groups.create', { name: group }, (err, response) => {
            if (response.ok) {
              chans.push({ id: response.group.id, name: response.group.name, category: GROUPS[group] })
              callback()
            } else {
              console.log('Creating group ' + group + ' failed:')
              console.log(response)
            }
          })
        }
      }, () => resolve(chans))
    })
  }

  prepareMafiaPartyGame() {
    return new Promise((resolve, reject) => {
      async.parallel({
        chans: (callback) => {
          this.getChannels()
            .then(channels => this.initGameChannels(channels))
            .then((channels) => callback(null, channels))
        },
        groups: (callback) => {
          this.getGroups()
            .then(groups => this.initGameGroups(groups))
            .then((groups) => callback(null, groups))
        }
      }, (err, results) => resolve(_.concat(results.chans, results.groups)))
    })
  }
}

export class MafiaPartyGame {
  constructor(mafiaGameMaster, chans) {
    this.mafiaGameMaster = mafiaGameMaster
    this.chans = chans
    this.game = null
    this.initiated = false
    this.started = false
    this.eventEmitter = new EventEmitter()
    console.log('new game created')
    console.log(chans)
    this.listen()
  }

  listen() {
    this.mafiaGameMaster.masterEmitter.on('command', command => this.runCommands(command))
    this.mafiaGameMaster.masterEmitter.on('message', data => this.eventEmitter.emit('message', data))
  }


  runCommands(command) {
    switch (command) {
      case 'setroles':
        this.setRoles()
        break
      case 'startgame':
        this.startGame()
        break
      default:
        console.log('unknown command: ' + command)
    }
  }

  setRoles() {
    this.initiated = true
    this.getChannelPlayers(_.find(this.chans, { category: 'town-room' })
        .id)
      .then(players => {
        console.log(players)
        this.game = new Game(this.eventEmitter, this.mafiaGameMaster.slackApi, players, this.chans)
        this.game.init()
      })
  }

  startGame() {
    if (this.initiated && !this.started) {
      this.started = true
      this.game.start()
    }
  }

  getPlayers() {
    return new Promise((resolve, reject) => {
      const players = []
      this.mafiaGameMaster.slackApi.api('users.list', (err, response) => {
        if (response.ok) {
          _.forEach(response.members, member => {
            if (!member.is_bot && member.name != 'slackbot' && member.name != process.env.MAFIA_API_NAME) {
              players.push(_.pick(member, ['id', 'name']))
            }
          })
          resolve(players)
        } else {
          console.log('cannot retrieve users list')
        }
      })
    })
  }

  getChannelPlayers(chanID) {
    return new Promise((resolve, reject) => {
      const channelPlayers = []
      this.mafiaGameMaster.slackApi.api('channels.info', { channel: chanID }, (err, response) => {
        this.getPlayers()
          .then(players => {
            _.forEach(players, p => {
              if (_.indexOf(response.channel.members, p.id) > -1) {
                channelPlayers.push(p)
              }
            })
            resolve(channelPlayers)
          })
      })
    })
  }
}
