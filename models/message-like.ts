import Driver from '../drivers/driver'
import User from './user'

export default class MessageLike {
  id: string
  user: User
  content: string
  channel: string
  driver: Driver
  constructor(
    id: string,
    user: User,
    text: string,
    channel: string,
    driver: Driver,
  ) {
    this.id = id
    this.user = user
    this.content = text
    this.channel = channel
    this.driver = driver
  }
  public async reply(text: string): Promise<MessageLike> {
    return this.driver.send(text, this.channel)
  }
}
