import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class SurvivorStrings extends MafiaGameStrings {
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
                en: 'survivor',
                fr: 'survivant'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'An apathetic individual who just wants to stay alive.',
                fr: 'Une personne sans opinion qui veut juste rester vivant.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalSurvivor,
                fr: miscStrings.fr.desc.goalSurvivor
              }
            case 'nightAbility':
              return {
                en: 'Use a bulletproof vest, protecting the Survivor from being killed at night.',
                fr: 'Utilise un gilet pare balles qui protège des meurtres.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':gun: Use your bulletproof vest?',
      fr: ':gun: Enfiler votre gilet pare balles?'
    }))
  }

  resolveNightAbility() {
    return (super.toString({
      en: 'You use your bulletproof vest.',
      fr: 'Vous enfilez votre gilet pare balles.'
    }))
  }
}
