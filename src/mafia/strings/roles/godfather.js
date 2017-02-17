import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class GodfatherStrings extends MafiaGameStrings {
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
                en: 'godfather',
                fr: 'parrain'
              }
            case 'particle':
              return {
                en: 'the',
                fr: 'le'
              }
            case 'summary':
              return {
                en: 'The capofamiglia of the town\'s organized mafia syndicate. You appear as innoncent in front of investigative roles.',
                fr: 'Le capofamiglia du réseau mafia de la ville. Votre discrétion et votre influence vous rend innocent aux yeux des enquêteurs.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalMafia,
                fr: miscStrings.fr.desc.goalMafia
              }
            case 'nightAbility':
              return {
                en: 'Send your mafiosi to kill off citizens.',
                fr: 'Envoyez vos hommes de main éliminer les citoyens'
              }
          }
        }
      )()
    ))
  }
}
