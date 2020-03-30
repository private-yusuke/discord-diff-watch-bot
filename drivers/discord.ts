import Driver from './driver'
import * as Discord from 'discord.js'
import config from '../config.json'
import moment from 'moment'
import { Stream } from 'stream'
import MessageLike from '../models/message-like'
import User from '../models/user'

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

    const sleep = (msec: number): Promise<unknown> =>
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
  normalizeUser(user: Discord.User): User {
    return new User(user.id, user.username, user.username, user.bot)
  }
  async send(content: string, channel: string): Promise<MessageLike> {
    const c = this.client.channels.cache.get(channel) as Discord.TextChannel
    if (!c) throw new Error(`Channel not found: ${channel}`)
    const res = await c.send(content)
    return new MessageLike(
      res.id,
      this.normalizeUser(res.author),
      res.content,
      res.channel.id,
      this,
    )
  }

  async sendAll(content: string): Promise<MessageLike[]> {
    const arr: MessageLike[] = []
    if (this.channels.length > 0)
      for (const channel of this.channels) {
        const res = await this.send(content, channel.id)
        arr.push(res)
      }
    return arr
  }
  async upload(
    content: string,
    file: string | Buffer | Stream,
    title: string,
    channel: string,
  ): Promise<MessageLike> {
    const attachment = new Discord.MessageAttachment(file, title)

    const c = this.client.channels.cache.get(channel) as Discord.TextChannel
    const res = await c.send(content, {
      files: [attachment],
    })
    return new MessageLike(
      res.id,
      this.normalizeUser(res.author),
      res.content,
      res.channel.id,
      this,
    )
  }

  async uploadAll(
    content: string,
    file: string | Buffer | Stream,
    title: string,
  ): Promise<MessageLike[]> {
    const arr: MessageLike[] = []
    if (this.channels.length > 0) {
      for (const channel of this.channels) {
        const res = await this.upload(content, file, title, channel.id)
        arr.push(res)
      }
    }
    return arr
  }
}
