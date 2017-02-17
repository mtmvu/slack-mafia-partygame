import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class JesterStrings extends MafiaGameStrings {
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
                en: 'jester',
                fr: 'bouffon'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A lunatic whose life\'s goal is to be publicly executed.',
                fr: 'Un lunatic dont le rêve est de se faire lyncher.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalJester,
                fr: miscStrings.fr.desc.goalJester
              }
            case 'nightAbility':
              return {
                en: 'Jester has no ability.',
                fr: 'Pas de compétences.'
              }
          }
        }
      )()
    ))
  }
}
