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
  onMessage?: (message: MessageLike) => void

  constructor() {
    this.client = new Discord.Client()
    this.channels = []
  }

  async initialize(motd: boolean): Promise<void> {
    await this.client.login(config.discord.token)

    // Waiting for logging in.
    await new Promise((resolve) => {
      this.client.on('ready', () => {
        resolve()
      })
    })

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
    this.client.on('message', (message) => {
      // Partial messages are not needed so skip them.
      if (message.partial) return
      const msg = this.normalizeMessage(message)
      if (this.onMessage) this.onMessage(msg)
    })

    console.log(`Discord init done! ${this.channels}`)
  }
  normalizeUser(message: Discord.Message): User {
    let member: Discord.GuildMember | undefined
    if (message.guild)
      member = message.guild.members.cache.get(message.author.id)
    let nickname: string
    if (member && member.nickname) nickname = member.nickname
    else nickname = message.author.username
    return new User(
      message.author.id,
      nickname,
      message.author.username,
      message.author.bot,
      Array.from(member ? member.roles.cache.keys() : []),
    )
  }
  normalizeMessage(message: Discord.Message): MessageLike {
    message.member
    return new MessageLike(
      message.id,
      this.normalizeUser(message),
      message.content,
      message.channel.id,
      this,
    )
  }
  async send(content: string, channel: string): Promise<MessageLike> {
    const c = this.client.channels.cache.get(channel) as Discord.TextChannel
    if (!c) throw new Error(`Channel not found: ${channel}`)
    const res = await c.send(content)
    return this.normalizeMessage(res)
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
      this.normalizeUser(res),
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
