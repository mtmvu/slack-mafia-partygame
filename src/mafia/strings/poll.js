import MafiaGameStrings from './MafiaGameStrings'

export default class PollStrings extends MafiaGameStrings {
  constructor(lang) {
    super(lang)
  }

  remaining() {
    return (super.toString({
      en: '5 seconds left.',
      fr: 'Il reste 5 secondes.'
    }))
  }

  ended() {
    return (super.toString({
      en: 'Vote has ended.\n',
      fr: 'Vote terminé.\n'
    }))
  }
}
