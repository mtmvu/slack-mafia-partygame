const miscStrings = {
  en: {
    desc: {
      goalTown: 'Lynch every criminal and evildoer',
      goalMafia: 'Kill off the Town and everyone else who would oppose you.',
      goalSurvivor: 'Survive to the end of the game, regardless of whether or not the Town or Mafia win.',
      goalJester: 'Die by being lynched during the day.',
      goalSerialKiller: 'Be the last person left alive.',
      goalArsonist: '	Be the last person left alive'
    },

    investigation: {
      mafia: 'Mafia',
      innocent: 'Not suspicious',
      serialKiller: 'Serial Killer',
      arsonist: 'Arsonist'
    },

    crimes: {
      trespassing: 'Trespassing',
      kidnapping: 'Kidnapping',
      noCrime: 'No crime',
      corruption: 'Corruption',
      identityTheft: 'Identity theft',
      soliciting: 'Soliciting',
      murder: 'Murder',
      disturbingThePeace: 'Disturbing the peace',
      conspiracy: 'Conspiracy',
      destructionOfProperty: 'Destruction of property',
      arson: 'Arson'
    },

    yes: 'Yes',
    no: 'No',

    lastWill(name) {
      return name + "'s last will"
    },

    cleaned: 'Unknown',
    roleBlocked: 'You have been role blocked. Your action has been cancelled.'

  },

  fr: {
    desc: {
      goalTown: 'Exécuter tout les criminels et malfaiteurs.',
      goalMafia: 'Eliminer la ville et tous ceux qui s\'opposeront à vous.',
      goalSurvivor: 'Survivre jusqu\'à la fin de la partie, peu importe le camp qui en sort victorieux.',
      goalJester: 'Mourir en étant lynché durant la journée.',
      goalSerialKiller: 'Devenir l\'unique survivant de la ville.',
      goalArsonist: 'Devenir l\'unique survivant de la ville.'
    },

    investigation: {
      mafia: 'Mafia',
      town: 'Non suspect',
      serialKiller: 'Tueur en série',
      arsonist: 'Pyromane'
    },

    crimes: {
      trespassing: 'Intrusion',
      kidnapping: 'Kidnapping',
      noCrime: 'Pas de crime',
      corruption: 'Corruption',
      identityTheft: 'Vol d\'identité',
      soliciting: 'Racolage',
      murder: 'Meurtre',
      disturbingThePeace: 'Trouble à l\'ordre',
      conspiracy: 'Complot',
      destructionOfProperty: 'Destruction de biens',
      arson: 'Incendie criminel'
    },

    yes: 'Oui',
    no: 'Non',

    lastWill(name) {
      return 'Dernier testament de ' + name
    },

    cleaned: 'Inconnu',
    roleBlocked: 'Vous avez été "rôle-bloqué". Votre action a été annulée.'
  }
}

export default miscStrings
