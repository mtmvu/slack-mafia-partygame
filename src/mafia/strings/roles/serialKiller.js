import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class SerialKillerStrings extends MafiaGameStrings {
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
                en: 'serial killer',
                fr: 'tueur en série'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A deranged criminal who hates the world.',
                fr: 'Un psychopathe.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalSerialKiller,
                fr: miscStrings.fr.desc.goalSerialKiller
              }
            case 'nightAbility':
              return {
                en: 'Kill one target at night.',
                fr: 'Tue une personne la nuit.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':knife: Who do you want to kill?',
      fr: ':knife: Qui voulez vous tuer?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'kill':
              return {
                en: ':knife: You are going to kill *' + args + '*',
                fr: ':knife: Vous allez tuer *' + args + '*'
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
