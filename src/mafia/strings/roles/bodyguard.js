import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class BodyguardStrings extends MafiaGameStrings {
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
                en: 'bodyguard',
                fr: 'garde du corps'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A war veteran who secretly makes a living by selling protection.',
                fr: 'Un ancien soldat reconvertit dans la protection rapprochée.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'Guard one player each night. If someone attacks a guarded player, both the attacker and the Bodyguard die instead of the guarded player.',
                fr: 'Protège une personne chaque nuit. Si cette dernière est attaquée, l\'assaillant et le garde du corps meurt à sa place.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':muscle: Who do you want to protect?',
      fr: ':muscle: Qui voulez vous protéger?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'protection':
              return {
                en: 'You are now guarding *' + args + '*',
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
