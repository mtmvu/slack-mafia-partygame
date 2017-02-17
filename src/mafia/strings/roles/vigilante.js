import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class VigilanteStrings extends MafiaGameStrings {
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
                en: 'vigilante',
                fr: 'justicier'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A dirty cop who will ignore the law and order to enact justice.',
                fr: 'Un policier qui désire faire justice par lui même.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'Kill one target at night. (max 2)',
                fr: 'Tue une personne chaque nuit. (max 2)'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':oncoming_police_car: Kill somebody?',
      fr: ':oncoming_police_car: Qui voulez vous abattre?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'kill':
              return {
                en: ':gun: You are going to kill *' + args + '*',
                fr: ':gun: Vous allez tuer *' + args + '*'
              }
            case 'noKill':
              return {
                en: 'You do nothing.',
                fr: 'Vous ne faîtes rien.'
              }
          }
        }
      )()
    ))
  }
}
