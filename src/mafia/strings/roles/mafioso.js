import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class MafiosoStrings extends MafiaGameStrings {
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
                en: 'mafioso',
                fr: 'mafioso'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A lowly soldato for one of the Don\'s borgata.',
                fr: 'Un homme de main à la solde des caporegime du Don.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalMafia,
                fr: miscStrings.fr.desc.goalMafia
              }
            case 'nightAbility':
              return {
                en: 'Kill citizens.',
                fr: 'Assassine des citoyens.'
              }
          }
        }
      )()
    ))
  }
}
