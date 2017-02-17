import { LANG } from '../settings/gameSettings'
import MafiosoStrings from '../strings/roles/mafioso'
import miscStrings from '../strings/misc'

const str = new MafiosoStrings(LANG)
const misc = miscStrings[LANG]

let mafioso = {
  name: 'Mafioso',
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
    isUnique: false,
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

export default mafioso
