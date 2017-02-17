import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class LookoutStrings extends MafiaGameStrings {
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
                en: 'lookout',
                fr: 'guetteur'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'An eagle-eyed observer, stealthily camping outside houses to gain information.',
                fr: 'Un observateur usant de sa furtivité pour observer les allées et venues.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'See everyone who visits his target each night.',
                fr: 'Surveille les visites qu\'une personne reçoit chaque nuit.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':mag: Who do you want to watch?',
      fr: ':mag: Qui voulez vous surveiller?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'trackingResult':
              return {
                en: ':mag: Tracking result: ',
                fr: ':mag: Résultat d\'enquête: '
              }

            case 'hasBeenVisited':
              return {
                en: '*' + args + '* has been visited by: ',
                fr: '*' + args + '* a reçu la visite de: '
              }

            case 'noVisit':
              return {
                en: 'nobody.',
                fr: 'personne.'
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
