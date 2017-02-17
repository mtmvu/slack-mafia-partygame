import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class CitizenStrings extends MafiaGameStrings {
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
                en: 'citizen',
                fr: 'citoyen'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A regular person who believes in truth and justice.',
                fr: 'Une personne normale qui croit en la verité et la justice.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'Citizens have no special traits. Sometimes they can get a bulletproof vest.',
                fr: 'Le citoyen n\'a pas de compétences particulières. Il est possible qu`il possède un gilet pare balles.'
              }
          }
        }
      )()
    ))
  }
}
