import { sample } from 'lodash'

export default class MafiaGameStrings {
  constructor(lang) {
    this.lang = lang
  }

  toString(strings, prepend = '', append = '') {
    let string = strings[this.lang] ? strings[this.lang] : '(missing translation)'
    if (string instanceof Array) {
      string = sample(string)
    }
    return (prepend + string + append)
  }
}
