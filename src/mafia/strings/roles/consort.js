import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class ConsortStrings extends MafiaGameStrings {
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
                en: 'consort',
                fr: 'consort'
              }
            case 'particle':
              return {
                en: 'an',
                fr: 'une'
              }
            case 'summary':
              return {
                en: 'A dancer working for organized crime.',
                fr: 'Une danceuse travaillant pour la mafia.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalMafia,
                fr: miscStrings.fr.desc.goalMafia
              }
            case 'nightAbility':
              return {
                en: 'Block someone\'s role at night, canceling their night abilities.',
                fr: 'Bloque une personne la nuit, l\'empêchant d\'utiliser sa compétence.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':kiss: Who do you want to block?',
      fr: ':kiss: Qui voulez vous bloquer?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'block':
              return {
                en: ':kiss: You spend the night with  *' + args + '*',
                fr: ':kiss: Vous passez la nuit avec *' + args + '*'
              }
            case 'noBlock':
              return {
                en: 'You do nothing.',
                fr: 'Pas de racolage cette nuit.'
              }
          }
        }
      )()
    ))
  }
}
