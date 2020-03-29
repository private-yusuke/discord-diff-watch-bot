import Driver from './driver'
import * as Discord from 'discord.js'
import config from '../config.json'
import moment from 'moment'
import { Stream } from 'stream'

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
    const sleep = (msec: number) =>
      new Promise((resolve) => setTimeout(resolve, msec))
    await sleep(1000)

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
  send(message: string): void {
    if (this.channels.length > 0)
      this.channels.forEach((channel) => channel.send(message))
  }
  upload(
    message: string,
    content: string | Buffer | Stream,
    title: string,
  ): void {
    const attachment = new Discord.MessageAttachment(content, title)
    if (this.channels.length > 0) {
      this.channels.forEach(async (channel) => {
        let res: Discord.Message
        try {
          res = await channel.send(message, {
            files: [attachment],
          })
          console.log(res)
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
}
