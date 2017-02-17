import { LANG } from '../settings/gameSettings'
import GodfatherStrings from '../strings/roles/godfather'
import miscStrings from '../strings/misc'

const str = new GodfatherStrings(LANG)
const misc = miscStrings[LANG]

let godfather = {
  name: 'Godfather',
  affiliation: 'Mafia',
  category: 'Mafia Killing',
  desc: {
    name: str.desc('name'),
    particle: str.desc('particle'),
    summary: str.desc('summary'),
    goal: str.desc('goal'),
    nightAbility: str.desc('nightAbility')
  },
  params: {
    isUnique: true,
    immuneDetection: true,
    investigationCop: misc.investigation.mafia
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

export default godfather
