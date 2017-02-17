import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class CopStrings extends MafiaGameStrings {
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
                en: 'cop',
                fr: 'policier'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A member of law enforcement, forced into hiding because of the threat of murder.',
                fr: 'Un officier de police obligé de se cacher à cause de menaces de mort.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'Check one player each night for criminal activity.',
                fr: 'Enquête sur les activités criminelles d\'un joueur chaque nuit'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':mag: Who do you want to watch?',
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
                en: ':mag: Tracking result: *' + args.target + '* :arrow_right: *' + args.investigationResult + '*',
                fr: ':mag: Résultat d\'enquête: *' + args.target + '* :arrow_right: *' + args.investigationResult + '*'
              }
            case 'noInvestigation':
              return {
                en: 'No tracking this night.',
                fr: 'Pas d\'enquête cette nuit'
              }
          }
        }
      )()
    ))
  }
}
