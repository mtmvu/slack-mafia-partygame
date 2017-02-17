import SlackBot from 'slackbots'
import Slack from 'slack-node'
import Game from './Game'
import { GROUPS, CHANNELS } from './settings/gameSettings'
import _ from 'lodash'
import { EventEmitter } from 'events'


let main = {
  run: () => {
    let bot = new SlackBot({
      token: process.env.MAFIA_API_TOKEN,
      name: process.env.MAFIA_API_NAME
    })

    const webApi = new Slack(process.env.MAFIA_API_TOKEN)


    let game
    let gameInitiated = false
    let gamehasStarted = false

    let gameEmitter = new EventEmitter()

    function initGroups(botID) {
      webApi.api('groups.list', (err, response) => {
        _.forEach(response.groups, group => {
          if (_.indexOf(_.keys(GROUPS), group.name) > -1) {
            _.forEach(group.members, member => {
              if (member != botID)
                webApi.api('groups.kick', { channel: group.id, user: member })
            })
          }
        })
        const chans = _.map(response.groups, "name")
        _.forEach(_.keys(GROUPS), room => {
          if (_.indexOf(chans, room) == -1) {
            webApi.api('groups.create', { name: room })
          }
        })
      })
    }

    function initChannels(botID) {
      webApi.api('channels.list', (err, response) => {
        _.forEach(response.channels, channel => {
          if (_.indexOf(_.keys(CHANNELS), channel.name) > -1) {
            _.forEach(channel.members, member => {
              if (member != botID)
                webApi.api('channels.kick', { channel: channel.id, user: member })
            })
          }
        })
        const chans = _.map(response.channels, "name")
        _.forEach(_.keys(CHANNELS), room => {
          if (_.indexOf(chans, room) == -1) {
            webApi.api('channels.create', { name: room })
          }
        })
      })
    }

    function initializer(botID) {
      initChannels(botID)
      initGroups(botID)
      game = null
      gameInitiated = false
      gamehasStarted = false
    }

    bot.on('start', () => {
      const botID = bot.self.id

      bot.on('message', data => {
        if (data.type == 'message') {
          if ((data.text)
            .slice(0, 6) == '!mafia') {

            const command = _.lowerCase(data.text.slice(7))

            switch (command) {

              case 'init':
                initializer(botID)
                break;

              case 'newgame':
                bot.getGroups()
                  .then(dataGroups => bot.getChannels()
                    .then(dataChannels => {
                      var chans = []
                      _.forEach(dataGroups.groups, group => {
                        if (_.indexOf(_.keys(GROUPS), group.name) > -1) {
                          chans.push({ name: group.name, id: group.id, team: GROUPS[group.name] })
                        }
                      })
                      _.forEach(dataChannels.channels, channel => {
                        if (_.indexOf(_.keys(CHANNELS), channel.name) > -1) {
                          chans.push({ name: channel.name, id: channel.id, team: CHANNELS[channel.name] })
                        }
                      })
                      bot.getChannel(_.find(chans, o => o.team == 'town-room')
                          .name)
                        .then(data => {
                          bot.getUsers()
                            .then(dataUsers => {
                              var players = []
                              _.forEach(dataUsers.members, member => {
                                if (!member.is_bot && !member.is_admin && member.name != 'slackbot') {
                                  if (_.indexOf(data.members, member.id))
                                    players.push({ id: member.id, name: member.name })
                                }
                              })
                              if (!gameInitiated) {
                                game = new Game(gameEmitter, webApi, players, chans)
                                game.init()
                                gameInitiated = true
                              }
                            })
                        })
                    }))
                break

              case 'start':
                if (gameInitiated && !gamehasStarted) {
                  game.start()
                  gamehasStarted = true
                }
                break

              case 'force-restart ' + process.env.MAFIA_PASSWORD:
                break

              default:
                break

            }
          }
        }
        if (data.type == 'message' && data.user != botID) {
          gameEmitter.emit('newMessage', data)
        }
      })

    })

  }
}

export default main
