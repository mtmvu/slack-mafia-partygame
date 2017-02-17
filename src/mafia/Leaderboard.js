import sqlite3 from 'sqlite3'
import _ from 'lodash'
import async from 'async'

export default class Leaderboard {
  constructor(name) {
    this.db = new sqlite3.Database('./leaderboard.db')
    this.table = name
    this.init()
  }

  init() {
    this.db.run('CREATE TABLE IF NOT EXISTS ' + this.table + '(playerId TEXT not null, playerName TEXT not null, score int not null)')
  }


  update(scores) {
    return new Promise((resolve, reject) => {
      this.getPlayers()
        .then(players => {
          async.forEach(scores, (score, callback) => {
            if (_.indexOf(players, score.playerId) > -1) {
              this.db.run('UPDATE ' + this.table + ' SET score = score + ' + score.score +
                ", playerName = '" + score.playerName + "' " +
                " WHERE playerId='" + score.playerId + "'", () => callback())
            } else {
              this.db.run("INSERT INTO " + this.table + " (playerId,playerName,score) VALUES('" +
                score.playerId + "','" + score.playerName + "'," + score.score + ')', () => callback())
            }
          }, () => resolve(true))
        })
    })
  }

  reset() {
    this.db.run('DROP TABLE IF EXISTS ' + this.table, () => this.init())
  }

  getScores() {
    return new Promise((resolve, reject) => {
      this.db.all('select * from ' + this.table, (err, response) => {
        resolve(_.orderBy(response, 'score', 'desc'))
      })
    })
  }

  getPlayers() {
    return new Promise((resolve, reject) => {
      const players = []
      this.db.all('select playerId from ' + this.table, (err, response) => {
        _.forEach(response, r => {
          players.push(r.playerId)
        })
        resolve(players)
      })
    })
  }

  close() {
    this.db.close()
  }
}
