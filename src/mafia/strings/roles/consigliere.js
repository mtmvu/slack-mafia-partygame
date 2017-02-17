import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class ConsigliereStrings extends MafiaGameStrings {
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
                en: 'consigliere',
                fr: 'consigliere'
              }
            case 'particle':
              return {
                en: 'the',
                fr: 'le'
              }
            case 'summary':
              return {
                en: 'A counselor to the boss of a crime family.',
                fr: 'Le bras droit du parrain.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalMafia,
                fr: miscStrings.fr.desc.goalMafia
              }
            case 'nightAbility':
              return {
                en: 'Check one player each night for that player\'s criminal record.',
                fr: 'Epluche le casier judiciaire d\'un joueur chaque nuit.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':mag: Who do you want to check?',
      fr: ':mag: Sur qui voulez vous enquêter?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'investigationResult':
              return {
                en: ':mag: Investigation result: *' + args.name + '* :arrow_right: * ' + args.result + '*',
                fr: ':mag: Résultat d\'enquête: *' + args.name + '* :arrow_right: * ' + args.result + '*'
              }
            case 'noInvestigation':
              return {
                en: 'You do nothing.',
                fr: 'Pas d\'enquête cette nuit'
              }
          }
        }
      )()
    ))
  }
}
