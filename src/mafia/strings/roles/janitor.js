import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class JanitorStrings extends MafiaGameStrings {
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
                en: 'janitor',
                fr: 'concierge'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A sanitation expert working for organized crime.',
                fr: 'Un nettoyeur expérimenté au service du crime organisé.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalMafia,
                fr: miscStrings.fr.desc.goalMafia
              }
            case 'nightAbility':
              return {
                en: 'Sanitize one player each night. If the player is killed that night, his role won`t be revealed and his last will will be cleared.',
                fr: 'Nettoie un joueur chaque nuit. Si le joueur est tué cette nuit là, son rôle ne sera pas dévoilé le jour suivant et son testament sera effacé.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':toilet: Who do you want to sanitize?',
      fr: ':toilet: Qui voulez vous rendre nettoyer?'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'sanitize':
              return {
                en: ':toilet: You sanitize  *' + args + '*.',
                fr: ':toilet: Vous nettoyez *' + args + '*.'
              }
            case 'noSanitize':
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
