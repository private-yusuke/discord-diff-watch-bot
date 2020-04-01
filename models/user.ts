export default class User {
  id: string
  name: string
  username: string
  isBot: boolean
  group: string[]

  constructor(
    id: string,
    name: string,
    username: string,
    isBot: boolean,
    group: string[],
  ) {
    this.id = id
    this.name = name
    this.username = username
    this.isBot = isBot
    this.group = group
  }
}
