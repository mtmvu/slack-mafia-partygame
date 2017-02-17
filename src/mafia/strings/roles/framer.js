import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class FramerStrings extends MafiaGameStrings {
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
                en: 'framer',
                fr: 'faussaire'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A skilled framer working for organized crime.',
                fr: 'Un expert en faux-papiers.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalMafia,
                fr: miscStrings.fr.desc.goalMafia
              }
            case 'nightAbility':
              return {
                en: 'Frame one player each night. The player will appear as suspicious for investigative roles only for that night.',
                fr: 'Fausse l\'identité d\'un joueur. Il apparaîtra comme suspect aux yeux des enquêteurs seulement cette nuit là.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':performing_arts: Who do you want to frame?',
      fr: ':performing_arts: Qui voulez vous rendre suspect?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'frame':
              return {
                en: ':performing_arts: You frame  *' + args + '*',
                fr: ':performing_arts: *' + args + '* apparaît maintenant comme suspect.'
              }
            case 'noFrame':
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
