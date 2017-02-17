import MafiaGameStrings from './MafiaGameStrings'

export default class NightCycleStrings extends MafiaGameStrings {
  constructor(lang) {
    super(lang)
  }

  start() {
    return (super.toString({
      en: ':crescent_moon: The town is sleeping.',
      fr: ':crescent_moon: C\'est la nuit.'
    }))
  }

  end() {
    return (super.toString({
      en: ':city_sunrise: It\'s dawn. The town will soon awake.',
      fr: ':city_sunrise: Le jour va bientôt se lever.'
    }))
  }

  startMafia() {
    return (super.toString({
      en: ':gun: Choose your target:',
      fr: ':gun: Choisissez votre cible:'
    }))
  }

  endMafia(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'kill':
              return {
                en: '*' + args.killer + '* is going to kill *' + args.target + '*',
                fr: '*' + args.killer + '* va assassiner *' + args.target + '*'
              }
            case 'noKill':
              return {
                en: 'You decided to stay low.',
                fr: 'Vous décidez de faire profil bas.'
              }
            case 'noKiller':
              return {
                en: 'It seems that nobody brought a gun...',
                fr: 'Personne n\'a apporté d\'arme...'
              }
          }
        }
      )()
    ))
  }

  resolve(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'immune':
              return {
                en: 'Your target is too strong, you failed to kill him/her.',
                fr: 'Vous n\'avez pas réussi à vous débarasser de votre cible.'
              }
            case 'doctor':
              return {
                en: 'Your target was attacked this night.',
                fr: 'Votre cible a été attaquée cette nuit.'
              }
          }
        }
      )()
    ))
  }

}
