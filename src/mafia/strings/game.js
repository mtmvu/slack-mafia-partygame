import MafiaGameStrings from './MafiaGameStrings'

export default class GameStrings extends MafiaGameStrings {
  constructor(lang) {
    super(lang)
  }

  init(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'init':
              return {
                en: '<!channel> Game has been initialized!\n',
                fr: '<!channel> La partie a été initialisée\n'
              }
            case 'setup':
              return {
                en: 'Game setup: ' + args.nTown + ' Town vs ' + args.nMafia + ' Mafia vs ' + args.nNeutral + ' Neutral',
                fr: 'Configuration de la partie: ' + args.nTown + ' Town vs ' + args.nMafia + ' Mafia vs ' + args.nNeutral + ' Neutral'
              }
            case 'role':
              return {
                en: 'You are ' + args.particle + ' *' + args.name + '*: ' + args.summary + '\nYour goal? ' + args.goal + '\nYour ability: ' + args.nightAbility,
                fr: 'Vous êtes ' + args.particle + ' *' + args.name + '*: ' + args.summary + '\nVotre objectif? ' + args.goal + '\nVotre compétence: ' + args.nightAbility
              }
          }
        }
      )()
    ))
  }

  start(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'start':
              return {
                en: '<!channel> Game has started!',
                fr: '<!channel> La partie commence'
              }
            case 'night':
              return {
                en: ':waxing_crescent_moon: It\'s getting dark.',
                fr: ':waxing_crescent_moon: La nuit approche.'
              }
          }
        }
      )()
    ))
  }

  mute(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'night':
              return {
                en: ':no_entry: :zzz: You are not allowed to speak during the night',
                fr: ':no_entry: :zzz: Vous n\'êtes pas autorisé à parler durant la nuit.'
              }
            case 'dead':
              return {
                en: ':no_entry: :skull: Dead cannot speak.',
                fr: ':no_entry: :skull: Les morts ne peuvent pas parler.'
              }
            case 'muted':
              return {
                en: ':no_entry: :speech_balloon: You have been muted temporarly.',
                fr: ':no_entry: :speech_balloon: Vous ne pouvez pas parler pour l\'instant.'
              }
          }
        }
      )()
    ))
  }

  mafia(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'newMember':
              return {
                en: ':loudspeaker: The Mafia has a new member! Welcome to <@' + args.id + '>. His role: *' + args.role.desc.name + '*',
                fr: ':loudspeaker: La Mafia accueille un nouveau membre. Bienvenue à <@' + args.id + '>. Son rôle: *' + args.role.desc.name + '*'
              }
            case 'updateRole':
              return {
                en: 'The mafia need more henchmen. *<@' + args + '>* is now a mafioso',
                fr: 'La mafia a besoin d\'hommes de main. *<@' + args + '>* est maintenant un mafioso.'
              }
          }
        }
      )()
    ))
  }

  show(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'graveyard':
              return {
                en: ':coffin: *The graveyard*: ',
                fr: ':coffin: *Le cimetière*: '
              }
            case 'alive':
              return {
                en: ':raised_hands: *Still alive*: ',
                fr: ':raised_hands: *Toujours en vie*: '
              }
            case 'score':
              return {
                en: '*Score*:\n',
                fr: '*Score*:\n'
              }
            case 'leaderboard':
              return {
                en: '*Leaderboard*:\n',
                fr: '*Leaderboard*:\n'
              }
          }
        }
      )()
    ))
  }

  victim(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'announce':
              return {
                en: '*' + args.name + '* is dead. ' + args.lynch + args.killType + ' He/She was ' + ' *' + args.role + '*',
                fr: '*' + args.name + '* est mort. ' + args.lynch + args.killType + ' Il/elle était ' + ' *' + args.role + '*'
              }
            case 'info':
              return {
                en: ':loudspeaker: :skull: You have been killed. You cannot participated anymore. Please do not send direct messages to other players who are still alive',
                fr: ':loudspeaker: :skull: Vous avez été éliminé. Vous ne pouvez plus participer au jeu. Veuillez à ne pas communiquer avec les autres joueurs restants dans la partie.'
              }
          }
        }
      )()
    ))
  }

  isLynch() {
    return super.toString({
      en: '\n Execution method: ',
      fr: '\n Méthode d\'éxécution: '
    })
  }

  kills(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'arsonist':
              return {
                en: ['He/she was incinerated. :fire:',
                    'He / She was burnt to death. :fire:',
                    'He / She was killed in a fire. :fire:'
                  ],
                fr: ['Il/Elle a été immolé(e). :fire:',
                  'Il/Elle a péri dans un incendie. :fire:'
                  ]
              }
            case 'bodyguard':
              return {
                en: ['He/She was killed in a duel. :crossed_swords:'],
                fr: ['Il/Elle est mort(e) dans un duel.:crossed_swords:']
              }
            case 'lynch':
              return {
                en: ['immolation :fire:',
                    'electrocution :zap:',
                    'firing Squad :fire:',
                    'poison :non-potable_water:',
                    'lynching :facepunch::anger:'
                    ],
                fr: ['immolation :fire:',
                    'electrocution :zap:',
                    'peloton d\'éxécution :fire:',
                    'poison :non-potable_water:',
                    'lynchage :facepunch::anger:'
                    ]
              }
            case 'mafia':
              return {
                en: ['He/She was shot at close range. :gun:',
                'He/She was also riddled with bullets at close range. :gun:'],
                fr: ['Il/Elle a été abbatu(e) à bout portant. :gun:',
                'Son corps est criblé de balles tirées à bout portants. :gun:']
              }
            case 'serialkiller':
              return {
                en: ['He/She had multiple stab wounds. :knife:'],
                fr: ['Il/Elle a reçu plusieurs coups de couteau. :knife:']
              }
            case 'veteran':
              return {
                en: ['He/She was killed with a military-grade assault rifle. :gun:',
                'He/She had multiple wounds from a fragmentation grenade. :bomb:'],
                fr: ['Il/Elle a été tué(e) par un fusil d\'assaut :gun:',
                'Il/Elle a succombé à ses blessures provenant d\'une grenade. :bomb:']
              }
            case 'vigilante':
              return {
                en: ['He/She was shot by a police officer gun. :gun:'],
                fr: ['Il/Elle a été tué(e) par une arme de police. :gun:']
              }
          }
        }
      )()
    ))
  }

  victory(category) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'Town':
              return {
                en: 'The town has won!',
                fr: 'La ville a éliminé la mafia!'
              }
            case 'Mafia':
              return {
                en: 'The mafia has won!',
                fr: 'La mafia a pris le contrôle de la ville!'
              }
            case 'Arsonist':
              return {
                en: 'The arsonist has won!',
                fr: 'Le pyromane a gagné!'
              }
            case 'SerialKiller':
              return {
                en: 'The serial killer has won!',
                fr: 'La tueur en série a gagné!'
              }
            case 'Survivor':
              return {
                en: 'The survivor has won!',
                fr: 'Le survivant a gagné!'
              }
            case 'Jester':
              return {
                en: 'The jester has won! (well not really)',
                fr: 'Le bouffon a gagné! (enfin pas vraiment)'
              }
            case 'Draw':
              return {
                en: 'It\'s a draw. Everybody is dead!',
                fr: 'C\'est une égalité. Personne n\'a survécu!'
              }

            case 'end':
              return {
                en: ':loudspeaker: *The game has ended.*',
                fr: ':loudspeaker: *La partie est terminée.*'
              }
          }
        }
      )()
    ))
  }

}
