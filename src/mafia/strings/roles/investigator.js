import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class InvestigatorStrings extends MafiaGameStrings {
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
                en: 'investigator',
                fr: 'enquêteur'
              }
            case 'particle':
              return {
                en: 'an',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A private sleuth, discreetly aiding the townsfolk.',
                fr: 'Un agent privé aidant discrètement les citoyens.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
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
