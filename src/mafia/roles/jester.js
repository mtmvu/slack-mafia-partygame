import { LANG } from '../settings/gameSettings'
import JesterStrings from '../strings/roles/jester'
import miscStrings from '../strings/misc'

const str = new JesterStrings(LANG)
const misc = miscStrings[LANG]

let jester = {
  name: 'Jester',
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
    investigationCop: misc.investigation.innocent
  },

  activatePreNightAbility() {

  },

  activateNightAbility() {

  },

  resolveNightAbility() {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  },

  visit() {

  }
}

export default jester
