export default class Role {
  constructor(role) {
    this.name = role.name
    this.affiliation = role.affiliation
    this.category = role.category
    this.desc = role.desc
    this.params = role.params
    this.activatePreNightAbility = role.activatePreNightAbility
    this.activateNightAbility = role.activateNightAbility
    this.resolveNightAbility = role.resolveNightAbility
    this.visit = role.visit
  }

}
