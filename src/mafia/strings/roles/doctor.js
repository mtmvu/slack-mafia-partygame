import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class DoctorStrings extends MafiaGameStrings {
  constructor(lang) {
    super(lang)
  }

  desc(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'name':
              return {
                en: 'doctor',
                fr: 'docteur'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A secret surgeon skilled in trauma care.',
                fr: 'Un chirurgien spécialisé dans les urgences vitales.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'Visit someone at night to save them if someone tries to kill them.',
                fr: 'Choisit un joueur pour tenter de le sauver si il est la cible d\'un assassinat.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':ambulance: Who do you want to save?',
      fr: ':ambulance: Qui voulez vous sauvez?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'protection':
              return {
                en: 'You are going to save *' + args + '*',
                fr: 'Vous protégez *' + args + '*'
              }
            case 'noProtection':
              return {
                en: 'You stay at home.',
                fr: 'Vous restez chez vous.'
              }
          }
        }
      )()
    ))
  }
}
