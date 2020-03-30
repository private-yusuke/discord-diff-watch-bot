export default class User {
  id: string
  name: string
  username: string
  isBot: boolean

  constructor(id: string, name: string, username: string, isBot: boolean) {
    this.id = id
    this.name = name
    this.username = username
    this.isBot = isBot
  }
}
