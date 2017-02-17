import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class TrackerStrings extends MafiaGameStrings {
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
                en: 'tracker',
                fr: 'pisteur'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A skilled tracker, learning important information on behalf of the town.',
                fr: 'Un fin limier qui recueille d\'importantes informations pour la ville.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'Track one person\'s activity each night.',
                fr: 'Suit un joueur chaque nuit pour découvrir son activité.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':mag: Who do you want to track?',
      fr: ':mag: Qui voulez vous suivre?'
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

            case 'hasVisited':
              return {
                en: '*' + args.target + '* has visited *' + args.visit + '*\n',
                fr: '*' + args.target + '* a visité *' + args.visit + '*\n'
              }

            case 'hasNotVisited':
              return {
                en: '*' + args + '* didn\'t visit anyone this night.',
                fr: '*' + args + '* n\'a visité personne chez nuit'
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
