import MafiaGameStrings from './MafiaGameStrings'

export default class DayCycleStrings extends MafiaGameStrings {
  constructor(lang) {
    super(lang)
  }

  start(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'start':
              return {
                en: ':sunny: It\'s the morning.',
                fr: ':sunny: Le jour s\'est levé.',
              }
            case 'debate':
              return {
                en: ':speech_balloon: :question: The town is gathering to discuss about last night\'s events.',
                fr: ':speech_balloon: :question: La ville se réunit pour discuter des événements de la veille.'
              }
          }
        }
      )()
    ))
  }

  end() {
    return (super.toString({
      en: ':waxing_crescent_moon: It\'s getting dark. Let us reconvene tomorrow.',
      fr: ':waxing_crescent_moon: La nuit approche. Nous reprendrons demain.'
    }))
  }

  startDebate() {
    return (super.toString({
      en: 'Who is suspicious? :thinking_face:',
      fr: 'Qui est suspect? :thinking_face:'
    }))
  }

  endDebate(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'trial':
              return {
                en: '*<@' + args.name + '>*, the town has decided to put you to trial. :angry: \nYou are now on trial for conspiracy against the town. You have ' + args.time + ' seconds to prove your innocence. :hourglass_flowing_sand:',
                fr: '*<@' + args.name + '>*, la ville vous a désigné comme principal suspect. :angry: \n Vous êtes maintenant jugé pour complot contre la ville. Vous avez ' + args.time + ' secondes pour prouver votre innocence. :hourglass_flowing_sand:'
              }
            case 'noVote':
              return {
                en: 'It seems nobody is suspect. :innocent:',
                fr: 'Il n\'y a apparement pas de suspect. :innocent:'
              }
          }
        }
      )()
    ))
  }

  startTrial() {
    return (super.toString({
      en: 'Lynch? :knife:',
      fr: 'Lyncher? :knife:'
    }))
  }

  endTrial(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'draw':
              return {
                en: 'It\'s a draw. Let fate decide. :game_die:',
                fr: 'Egalité. Laissons le sort décider à notre place. :game_die:'
              }
            case 'die':
              return {
                en: 'Die :skull_and_crossbones: ',
                fr: 'Meurs :skull_and_crossbones:'
              }
            case 'live':
              return {
                en: 'Live :innocent:',
                fr: 'Vit :innocent:'
              }
            case 'lynch':
              return {
                en: ':loudspeaker: :skull_and_crossbones: The town has decided to lynch *' + args + '*',
                fr: ':loudspeaker: :skull_and_crossbones: La ville a décidé de lyncher *' + args + '*',
              }
            case 'innocent':
              return {
                en: 'The town has decided to pardon ' + args + ' :innocent:',
                fr: 'La ville a décidé d\'épargner' + args + ' :innocent:'
              }
            case 'noVote':
              return {
                en: 'Citizens are too afraid to vote. Nobody get lynched today. :zipper_mouth_face:',
                fr: 'Les citoyens sont trop effrayés. Personne ne sera lynché aujourd\'hui. :zipper_mouth_face:'
              }
          }
        }
      )()
    ))
  }

  restartDebate(restart) {
    return (super.toString(
      (
        () => {
          switch (restart) {
            case true:
              return {
                en: 'It\'s time to find a new suspect.',
                fr: 'Les citoyens se réunissent pour un nouveau vote'
              }
            case false:
              return {
                en: 'It\'s time to go home. :house:',
                fr: 'Il est temps de retourner dans vos demeures. :house:'
              }
          }
        }
      )()
    ))
  }

  announcements(nKills) {
    return (super.toString(
      (
        () => {
          switch (nKills) {
            case 0:
              return {
                en: 'Nobody died during the night.',
                fr: 'Personne n\'est morte ce soir.'
              }
            case 1:
              return {
                en: 'One of us did not survive the night.',
                fr: 'L\'un d\'entre nous n\'a pas survécu cette nuit.'

              }
            case 2:
              return {
                en: 'Some of us did not survive the night.',
                fr: 'Quelques uns n\'ont pas survécu cette nuit.'
              }
            case 3:
              return {
                en: 'Some of us did not survive the night.',
                fr: 'Quelques uns n\'ont pas survécu cette nuit.'
              }
            case 4:
              return {
                en: 'Many of us perished last night.',
                fr: 'Beaucoup d\'entre nous sont morts cette nuit.'
              }
            case 5:
              return {
                en: 'Many of us perished last night.',
                fr: 'Beaucoup d\'entre nous sont morts cette nuit.'
              }
            case 6:
              return {
                en: 'A mass quantity of people died last night.',
                fr: 'Un grand nombre de personnes sont mortes cette nuit.'
              }
            case 7:
              return {
                en: 'A mass quantity of people died last night.',
                fr: 'Un grand nombre de personnes sont mortes cette nuit.'
              }
            case 8:
              return {
                en: 'Most of the entire town was wiped out last night.',
                fr: 'La majorité de la ville a été décimée cette nuit.'
              }
            case 9:
              return {
                en: 'Most of the entire town was wiped out last night.',
                fr: 'La majorité de la ville a été décimée cette nuit.'
              }
            case 10:
              return {
                en: 'A veritable Armageddon decimated the town last night.',
                fr: 'Un véritable Armageddon a frappé la ville cette nuit.'

              }
            case 11:
              return {
                en: 'A veritable Armageddon decimated the town last night.',
                fr: 'Un véritable Armageddon a frappé la ville cette nuit.'
              }
            case 12:
              return {
                en: 'Literally the entire town was obliterated last night.',
                fr: 'La ville a été litéralement anénatie cette nuit.'

              }
            case 13:
              return {
                en: 'Literally the entire town was obliterated last night.',
                fr: 'La ville a été litéralement anénatie cette nuit.'
              }
            case 14:
              return {
                en: 'Your setup is shit.',
                fr: 'C\'est n\'importe quoi...'
              }
          }
        }
      )(),
      ':loudspeaker: '))
  }

}
