import _ from 'lodash'
import { SETUP, LANG, DATABASE_TABLE } from './settings/gameSettings'
import setups from './settings/setups'
import GameStrings from './strings/game'
import miscStrings from './strings/misc'
import arrayRoles from './roles/index'
import Player from './Player'
import Role from './Role'
import NightCycle from './NightCycle'
import DayCycle from './DayCycle'
import Leaderboard from './Leaderboard'
import { sleep } from './utils'
import request from 'request'
import fs from 'fs'

const str = new GameStrings(LANG)
const misc = miscStrings[LANG]

export default class Game {
  constructor(gameEmitter, slackApi, players, channels) {
    this.gameEmitter = gameEmitter
    this.slackApi = slackApi
    this.players = players
    this.channels = channels
    this.rolesDistribution = this.initRoles()
    this.gameState = {
      cycles: [],
      mutedPlayers: [],
      events: [],
      nightCount: 0,
      dayCount: 0
    }
  }

  // Initialisation of the game: Give a role to each player
  // display game distribution in town channel
  // invite mafia players to mafia room
  // start listener that will mute players following game state
  // start listener for commands
  // start listener for day/night cycle
  // dm each player for a brief description of their role and their objectives
  init() {
    // give a role to each player
    this.setPlayers()
    this.resetImmunity()
    // display game distribution
    const chan = this.getTownRoom()
    const distribution = _.countBy(this.rolesDistribution, 'affiliation')
    const nTown = distribution.Town || 0
    const nMafia = distribution.Mafia || 0
    const nNeutral = distribution.Neutral || 0
    let text = str.init('init')
    text += str.init('setup', { nTown: nTown, nMafia: nMafia, nNeutral: nNeutral })
    this.postMessage(chan, text)
      .then(() => {
        text = nTown + ' Town vs ' + nMafia + ' Mafia vs ' + nNeutral + ' Neutral'
        this.slackApi.api('channels.setTopic', { channel: chan, topic: text })
      })
    // invite mafia players in the mafia room
    _.forEach(this.getPlayers({ filters: { affiliation: 'Mafia' } }), player => {
      this.newMafiaRecruit(player)
    })
    // listen to new message for mute
    this.gameEmitter.on('message', data => this.mutePlayers(data))
    // listen to commands
    this.gameEmitter.on('message', data => this.commands(data))
    // listen to 'newCycle' to start new day/night cycle
    this.gameEmitter.on('newCycle', (cycle, events) => {
      if (cycle == 'night') {
        var newCycle = new NightCycle(this)
        this.gameState.nightCount = this.gameState.nightCount + 1
        this.gameState.cycles.push(newCycle)
        newCycle.start()
      }
      if (cycle == 'day') {
        var newCycle = new DayCycle(this, events)
        this.gameState.dayCount = this.gameState.dayCount + 1
        this.gameState.cycles.push(newCycle)
        newCycle.start()
      }
    })
    // dm each player for their role
    _.forEach(this.players, player => {
      const chan = player.id
      const text = str.init('role', player.role.desc)
      this.postMessage(chan, text)
    })

  }

  // Start the game: Alert channel then emit night cycle
  start() {
    const chan = this.getTownRoom()
    const text = str.start('start')
    this.postMessage(chan, text)
      .then(() => sleep(5))
      .then(() => this.postMessage(chan, str.start('night')))
      .then(() => sleep(5))
      .then(() => this.gameEmitter.emit('newCycle', 'night'))
  }


  end() {
    process.exit()
  }

  // muter
  mutePlayers(data) {
    // mute players in town room during night
    this.muteTownDuringNight(data)
    // mute dead players
    this.muteDeadPlayers(data)
    // mute players that are in gameState.mutedPlayers
    this.muteCasual(data)
  }

  // When cycle is night, if a played post a message in town channel, delete it and inform him/her
  muteTownDuringNight(data) {
    const chan = this.getTownRoom()
    if (_.last(this.gameState.cycles) instanceof NightCycle) {
      if (data.channel == chan) {
        this.slackApi.api('chat.delete', {
          channel: chan,
          ts: data.ts
        }, () => {
          this.postMessage(data.user, str.mute('night'))
        })
      }
    }
  }

  // Delete message if the player is dead and inform him/her
  muteDeadPlayers(data) {
    if (_.find(this.getPlayers({ alive: false }), {
        id: data.user
      })) {
      this.slackApi.api('chat.delete', {
        channel: data.channel,
        ts: data.ts
      }, () => {
        this.postMessage(data.user, str.mute('dead'))
      })
    }
  }

  // Delete messages from players who are in gameState.mutedPlayers array and inform him/her
  muteCasual(data) {
    const chan = this.getTownRoom()
    if (data.channel == chan) {
      if (_.find(this.gameState.mutedPlayers, {
          id: data.user
        })) {
        this.slackApi.api('chat.delete', {
          channel: data.channel,
          ts: data.ts
        }, () => {
          this.postMessage(data.user, str.mute('muted'))
        })
      }
    }
  }

  // listen to game commands
  commands(data) {
    const player = _.find(this.players, { id: data.user })
    const text = _.trim(data.text)
    // last will commands
    if (_.startsWith(text, '!lw')) {
      const splits = _.split(text, '!lw ')
      if (splits.length > 1) {
        player.newLastWill(splits[1])
      } else {
        player.showLastWill(player.id)
      }
      // reveal commands, doesn't work with all roles
    } else if (_.startsWith(text, '!reveal')) {
      if (_.last(this.gameState.cycles) instanceof NightCycle) {

      } else {

      }
    }
  }

  // Check if a role can be added in the game.rolesDistribution
  validateRole(role, existing) {
    let b = true
    if (role.params.isUnique) {
      _.forEach(existing, r => {
        if (r.name === role.name) {
          b = false
        }
      })
    }
    return b
  }

  // Generate rolesDistribution following setup
  initRoles() {
    const roles = []
    const n = this.players.length
    if (n < 4) {
      this.end()
    }
    let setup
    if (SETUP == 'default') {
      setup = _.find(setups[n], { id: 'default' })
    } else if (SETUP == 'random') {
      setup = _.sample(setups[n])
    } else {
      setup = _.find(setups[n], { id: SETUP })
      if (!setup) {
        setup = _.find(setups[n], { id: 'default' })
      }
    }

    if (!setup) {
      this.postMessage(this.getTownRoom(), str.noSetup(n))
        .then(() => this.end())
    }

    _.forEach(setup.roles, role => {
      roles.push(new Role(_.find(arrayRoles, { name: role })))
    })
    _.forOwn(setup.configurations, (count, category) => {
      let possibleRoles = _.filter(arrayRoles, { category: category })
      for (let i = 0; i < count; i++) {
        let role = _.sample(possibleRoles)
        while (!this.validateRole(role, roles)) {
          role = _.sample(possibleRoles)
        }
        role = new Role(role)
        roles.push(role)
      }
    })

    return _.shuffle(roles)
  }

  // Create Player object and
  // give a role to each players
  setPlayers() {
    const players = []
    _.forEach(this.players, (value, key) => {
      let player = new Player(value.id, value.name, this.rolesDistribution[key], this)
      players.push(player)
    })
    this.players = _.clone(players)
  }

  // getter for players still alive (except a player)
  getPlayersAlive(except = '') {
    return _.filter(this.players, p => { return (p.isAlive && p.name != except) })
  }

  // Getter for dead players
  getPlayersDead() {
    return _.filter(this.players, {
      isAlive: false
    })
  }

  // General getter for players, allows to pass filters on player's role
  getPlayers({ filters = {}, alive = true, except = '' } = {}) {
    const players = alive ? this.getPlayersAlive(except) : this.getPlayersDead()
    const res = []
    _.forEach(players, player => {
      if (_.isMatch(player.role, filters)) {
        res.push(player)
      }
    })
    return res
  }

  // Getter to display dead players and respective roles
  getGraveyard(showRole = true) {
    const graveyard = []
    _.forEach(this.getPlayers({ alive: false }), p => {
      showRole ? graveyard.push({
        name: p.name,
        role: p.role.desc.name
      }) : graveyard.push({
        name: p.name
      })
    })
    return graveyard
  }

  // Getter for town-room id
  getTownRoom() {
    return (_.find(this.channels, {
        category: 'town-room'
      })
      .id)
  }

  // Getter for mafia room id
  getMafiaRoom() {
    return (_.find(this.channels, {
        category: 'mafia-room'
      })
      .id)
  }

  // Post message of all dead players with their respective roles
  showGraveyard(chan) {
    return new Promise((resolve, reject) => {
      const graveyard = this.getGraveyard()
      let text = str.show('graveyard')
      _.forEach(graveyard, player => {
        text += ':skull: ' + player.name + ' (*' + player.role + '*) '
      })
      this.postMessage(chan, text)
        .then(() => resolve(true))
    })
  }

  // Post message of alive players
  showAlive(chan) {
    return new Promise((resolve, reject) => {
      const alive = this.getPlayers()
      let text = str.show('alive')
      _.forEach(alive, player => {
        text += ':innocent: ' + player.name + ' '
      })
      this.postMessage(chan, text)
        .then(() => resolve(true))
    })
  }

  // Post message of all players with their roles and theirs scores
  showScore() {
    return new Promise((resolve, reject) => {
      const chan = this.getTownRoom()
      let text = str.show('score')
      _.forEach(this.players, player => {
        text += player.name + ' (*' + player.role.desc.name + '*) :arrow_right: ' + String(player.score) + '\n'
      })
      this.postMessage(chan, text)
        .then(() => resolve(true))
    })
  }

  showLeaderboard(scores) {
    return new Promise((resolve, reject) => {
      const chan = this.getTownRoom()
      let text = str.show('leaderboard')
      for (let i = 0; i < scores.length; i++) {
        text += String(i + 1) + '. *' + scores[i].playerName + '* :arrow_right: ' + String(scores[i].score) + '\n'
      }
      this.postMessage(chan, text)
        .then(() => resolve(true))
    })
  }


  // check for victory
  checkVictory() {
    let winners = false
    const nMafia = this.getPlayers({ filters: { affiliation: 'Mafia' } })
      .length
    const nTown = this.getPlayers({ filters: { affiliation: 'Town' } })
      .length
    const nNeutral = this.getPlayers({ filters: { affiliation: 'Neutral' } })
      .length
    const neutralKilling = this.getPlayers({ filters: { category: 'Neutral Killing' } })

    if (nMafia == 0 && nNeutral == 0 && nTown == 0) {
      winners = 'Draw'
    } else if (nMafia == 0 && neutralKilling.length == 0 && nTown > 0) {
      winners = 'Town'
    } else if (nMafia > 0 && neutralKilling.length == 0 && nTown == 0) {
      winners = 'Mafia'
    } else if (nMafia == 0 && neutralKilling.length > 0 && nTown == 0) {
      const nArsonist = this.getPlayers({ filters: { name: 'Arsonist' } })
        .length
      if (nArsonist > 0) {
        winners = 'Arsonist'
      } else {
        winners = 'SerialKiller'
      }
    } else if (nMafia == 0 && neutralKilling.length && nTown == 0 & nNeutral > 0) {
      const nSurvivor = this.getPlayers({ filters: { name: 'Survivor' } })
        .length
      if (nSurvivor > 0) {
        winners = 'Survivor'
      } else {
        winners = 'Jester'
      }
    }

    return winners
  }

  // Post message of victory then end game
  resolveVictory(winners) {
    const chan = this.getTownRoom()
    const textEnd = str.victory('end')
    const textWin = str.victory(winners)

    this.postMessage(chan, textEnd)
      .then(() => sleep(2))
      .then(() => this.postMessage(chan, textWin))
      .then(() => this.downloadLeaderboard())
      .then(() => this.scorer(winners))
      .then(() => this.uploadLeaderboard())
      .then(() => this.end())
  }

  scorer(winners) {
    return new Promise((resolve, reject) => {
      const leaderboard = new Leaderboard(DATABASE_TABLE)
      const scores = []
      _.forEach(this.players, player => {
        // 5 points for participating
        player.score += 5
        // Mafia or town victory
        if (player.role.affiliation == winners) {
          switch (winners) {
            case 'Town':
              player.score += 30
              break
            case 'Mafia':
              player.score += 50
              break
            default:
              player.score += 0
          }
        }
        // Solo role
        else if (player.role.name == winners) {
          if (player.isAlive) {
            player.score += 80
          }
        }
        if (player.isAlive) {
          // 10 points for staying alive (30 for survivor)
          if (player.role.name == 'Survivor') {
            player.score += 30
          } else {
            player.score += 10
          }
        }
        scores.push({ playerId: player.id, playerName: player.name, score: player.score })
      })

      this.showScore()
        .then(() => leaderboard.update(scores))
        .then(() => leaderboard.getScores())
        .then(scores => this.showLeaderboard(scores))
        .then(() => {
          leaderboard.close()
          resolve(true)
        })
    })
  }

  downloadLeaderboard() {
    return new Promise((resolve, reject) => {
      this.slackApi.api('files.list', { channel: this.slackApi.botIM }, (err, response) => {
        if (response.ok) {
          let leaderboardFile = _.find(response.files, { name: 'leaderboard.db' })
          if (leaderboardFile) {
            const leaderboardURL = leaderboardFile.url_private_download
            const leaderboardFileId = leaderboardFile.id
            const options = {
              url: leaderboardURL,
              headers: {
                'Authorization': 'Bearer ' + process.env.MAFIA_API_TOKEN
              }
            }
            request.get(options)
              .pipe(fs.createWriteStream('./leaderboard.db'))
              .on('finish', () => this.slackApi.api('files.delete', { file: leaderboardFileId },
                () => resolve(true)))
          } else {
            resolve(true)
          }
        } else {
          resolve(true)
        }
      })
    })
  }

  uploadLeaderboard() {
    return new Promise((resolve, reject) => {
      const data = {
        file: fs.createReadStream('./leaderboard.db'),
        filename: 'leaderboard.db',
        title: 'leaderboard.db',
        channels: this.slackApi.botIM
      }
      this.slackApi.api('files.upload', data, () => resolve(true))
    })
  }

  resetProtections() {
    _.forEach(this.getPlayers(), player => {
      player.protections = 0
    })
  }

  resetRoleBlock() {
    _.forEach(this.getPlayers(), player => {
      player.roleBlocked = false
    })
  }

  resetFramed() {
    _.forEach(this.getPlayers(), player => {
      player.isFramed = false
    })
  }

  resetCleaned() {
    _.forEach(this.getPlayers(), player => {
      player.isSanitized = false
    })
  }

  resetImmunity() {
    _.forEach(this.getPlayers(), player => {
      player.hasNightImmunity = player.role.params.hasNightImmunity || false
      player.ignoreNightImmunity = player.role.params.ignoreNightImmunity || false
    })
  }

  resetPoll() {
    _.forEach(this.getPlayers(), player => {
      player.poll = null
    })
  }

  // Invite player to the mafia channel and alert the channeI
  newMafiaRecruit(player) {
    const chan = this.getMafiaRoom()
    this.slackApi.api('groups.invite', {
      channel: chan,
      user: player.id
    }, () => {
      const text = str.mafia('newMember', player)
      this.postMessage(chan, text)
    })
  }

  //if there is no more mafia killing role, transform a mafia player into a mafioso
  updateMafiaRoles() {
    return new Promise((resolve, reject) => {
      const mafia = this.getPlayers({ filters: { affiliation: 'Mafia' } })
      let killer = false
      _.forEach(mafia, m => {
        if (m.role.category == 'Mafia Killing') {
          killer = true
        }
      })
      if (!killer) {
        const newMafioso = _.sample(mafia)
        newMafioso.role = new Role(_.find(arrayRoles, { name: 'Mafioso' }))
        this.postMessage(this.getMafiaRoom(), str.mafia('updateRole', newMafioso.name))
          .then(() => resolve(true))
      } else {
        resolve(true)
      }
    })
  }

  // Set the player (victim) isAlive attribute to false then post a message to
  // both the town channel and the victim's direct message
  // Also display his last will
  // If the player was mafia, kick him from mafia channel
  newVictim(victim, killTypes) {
    return new Promise((resolve, reject) => {
      if (victim.isSanitized) {
        victim.role.desc.name = misc.cleaned
        victim.lastWill = ''
      }
      if (killTypes instanceof String) {
        killTypes = [killTypes]
      }
      const textKillTypes = _.join(_.map(killTypes, x => str.kills(x)), '\n ')
      const text = str.victim('announce', {
        name: victim.name,
        role: victim.role.desc.name,
        killType: textKillTypes,
        lynch: (_.indexOf(killTypes, 'lynch') > -1) ? str.isLynch() : ''
      })
      victim.isAlive = false
      if (victim.role.name == 'Jester' && (_.indexOf(killTypes, 'lynch') > -1)) {
        victim.score += 50
      }
      this.postMessage(this.getTownRoom(), text)
        .then(() => victim.showLastWill(this.getTownRoom()))
        .then(() => this.postMessage(victim.id, str.victim('info')))
        .then(() => this.slackApi.api('groups.kick', { channel: this.getMafiaRoom(), user: victim.id },
          () => resolve(true)))
    })
  }


  // Post message (support promises)
  postMessage(channel, text, as_user = true, username = '') {
    return new Promise((resolve, reject) => {
      this.slackApi.api('chat.postMessage', {
        channel: channel,
        text: text,
        as_user: as_user,
        username: username
      }, (err, response) => resolve({ err: err, response: response }))
    })
  }

  // Add players to the gameState.mutedPlayers array
  // NB the same player can be several times in gameState.mutedPlayers array
  mute(players) {
    _.forEach(players, p => {
      this.gameState.mutedPlayers.push(p)
    })
  }

  // REmove players from gameState.mutedPlayers array
  // NB after unmute, a player can still be muted if all of his references are still in the array
  // that's why i use  _.pullAt and not _.filter
  unmute(players) {
    const indexes = []
    _.forEach(players, p => {
      _.forEach(this.gameState.mutedPlayers, (muted, index) => {
        if (muted.id == p.id) {
          indexes.push(index)
        }
      })
    })
    _.pullAt(this.gameState.mutedPlayers, indexes)
  }

}
