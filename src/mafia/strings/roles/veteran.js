import miscStrings from '../misc'
import MafiaGameStrings from '../MafiaGameStrings'

export default class VeteranStrings extends MafiaGameStrings {
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
                en: 'veteran',
                fr: 'vétéran'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A paranoid, retired admiral who will shoot anyone who bothers him.',
                fr: 'Un général à la retraite devenu paranoïaque et prêt à tirer sur n\'importe qui qui le dérangerait.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalTown,
                fr: miscStrings.fr.desc.goalTown
              }
            case 'nightAbility':
              return {
                en: 'May go on alert during the night. If he goes on alert, will automatically kills any player who targets him that night. (max 2)',
                fr: 'Peut rester sur le qui-vive la nuit et ainsi tuer toute personne qui le visite. (max 2)'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':gun: Go on alert?',
      fr: ':gun: Rester sur le qui-vive?'
    }))
  }

  resolveNightAbility() {
    return (super.toString({
      en: 'You go on alert. Anyone who visits you this night will get shot.',
      fr: 'Vous êtes sur le qui-vive. Quiconque vous visite se fera tirer dessus.'
    }))
  }
}
