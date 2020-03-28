import Driver from './driver'
import * as Discord from 'discord.js'
import config from '../config.json'
import moment from 'moment'

export default class DiscordDriver implements Driver {
  name = 'discord'
  client: Discord.Client
  channels: Discord.TextChannel[]

  constructor(motd: boolean) {
    this.client = new Discord.Client()
    this.channels = []
    this.initialize(motd)
  }
  async initialize(motd: boolean): Promise<void> {
    await this.client.login(config.discord.token)
    /*const c = this.client.channels.cache.get(
      config.discord.channel,
    ) as Discord.TextChannel
    if (c) this.channel = c*/
    config.discord.channels.forEach((channel) => {
      const c = this.client.channels.cache.get(channel) as Discord.TextChannel
      if (c) this.channels.push(c)
    })
    if (motd && this.channels.length > 0) {
      this.channels.forEach((channel) =>
        channel.send(
          `Starting discord-diff-watch-bot. | ${moment().format(
            'YYYY-MM-DD HH:mm:ss',
          )}`,
        ),
      )
    }
    console.log(`Discord init done! ${this.channels}`)
  }
  send(content: string): void {
    if (this.channels.length > 0)
      this.channels.forEach((channel) => channel.send(content))
  }
}
