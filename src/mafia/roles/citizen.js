import { LANG } from '../settings/gameSettings'
import CitizenStrings from '../strings/roles/citizen'
import miscStrings from '../strings/misc'

const str = new CitizenStrings(LANG)
const misc = miscStrings[LANG]

let citizen = {
  name: 'Citizen',
  affiliation: 'Town',
  category: 'Town Government',
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

export default citizen
