import miscStrings from '../misc.js'
import MafiaGameStrings from '../MafiaGameStrings'

export default class ArsonistStrings extends MafiaGameStrings {
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
                en: 'arsonist',
                fr: 'pyromane'
              }
            case 'particle':
              return {
                en: 'a',
                fr: 'un'
              }
            case 'summary':
              return {
                en: 'A pyromaniac who only wants to see the world burn.',
                fr: 'Un pyromane qui désire brûler le monde entier.'
              }
            case 'goal':
              return {
                en: miscStrings.en.desc.goalArsonist,
                fr: miscStrings.fr.desc.goalArsonist
              }
            case 'nightAbility':
              return {
                en: 'Either douse a person in gasoline or kill all previously doused targets at night.',
                fr: 'Soit verse de l\'essence chez une personne, soit enflamme les personnes déjà arrosées.'
              }
          }
        }
      )()
    ))
  }

  activateNightAbility() {
    return (super.toString({
      en: ':fuelpump: Who do you want to douse?',
      fr: ':fuelpump: Sur qui voulez vous verser de l\'essence?'
    }))
  }

  burn() {
    return (super.toString({
      en: ':fire: Burn them all!',
      fr: ':fire: Burn them all!'
    }))
  }

  resolveNightAbility(category, args) {
    return (super.toString(
      (
        () => {
          switch (category) {
            case 'burn':
              return {
                en: ':fire: You are going to burn all the doused players.',
                fr: ':fire: Vous allez enflammer toutes les personnes arrosées.'
              }
            case 'douse':
              return {
                en: ':fuelpump: You are going to douse *' + args + '*',
                fr: ':fuelpump: Vous arroser *' + args + '*'
              }
            case 'doused':
              return {
                en: ':fuelpump: *You have been doused!*',
                fr: ':fuelpump: *Quelqu\'un vous a versé de l\'essence dessus!*'
              }
            case 'noDouse':
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
