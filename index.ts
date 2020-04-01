import moment from 'moment'
import Watcher from './watcher'
import config from './config.json'
import { Readable } from 'stream'
import DiscordDriver from './drivers/discord'
import MessageLike from './models/message-like'
import fetch from 'node-fetch'
import * as fs from 'fs'

function writeConfig(config: unknown): void {
  const path = `${__dirname}/config.json`
  fs.writeFileSync(path, JSON.stringify(config))
}

async function main(): Promise<void> {
  console.log('>>> Starting... <<<')
  console.log(moment().toString())
  console.log(config.watchInterval)

  const driver = new DiscordDriver()
  await driver.initialize(config.discord.motd)

  const duration = moment.duration(
    config.watchInterval.value,
    config.watchInterval.unit as moment.unitOfTime.Base,
  )
  const watcher = new Watcher(config.watchURLs, duration)
  watcher.onDiff = (diff): void => {
    console.debug(`diff found: ${moment().toString()} at ${diff.url}`)
    console.debug(diff.d)
    const message = `更新が検出されました！${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}\n${diff.url}`
    const content = `更新が検出されました！${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}\`\`\`${diff.d}\`\`\`\n${diff.url}`
    if (content.length > config.discord.threshold) {
      const readable = new Readable()
      readable.push(diff.d)
      readable.push(null)
      driver.uploadAll(message, readable, `diff-${moment().toString()}.txt`)
    } else {
      driver.sendAll(content)
    }
  }

  driver.onMessage = async (msg: MessageLike): Promise<void> => {
    if (msg.content.startsWith(config.commandPrefix)) {
      const command = msg.content.substr(1).split(' ')
      console.debug(command)
      console.debug(msg.user.group)
      switch (command[0]) {
        case 'watchadd':
          if (command.length < 2) {
            msg.reply('Usage: watchadd <url>')
          } else if (
            msg.user.group.some((v) =>
              config.discord.permittedGroups.includes(v),
            )
          ) {
            const url = command[1]
            console.debug(url)
            let testRes
            try {
              testRes = await fetch(url)
              if (!testRes.ok)
                msg.reply(
                  `Error: server returned ${testRes.status} ${testRes.statusText}`,
                )
              else {
                config.watchURLs.push(url)
                writeConfig(config)
                msg.reply(`Successfully added the URL: ${url}`)
              }
            } catch (e) {
              console.debug(e)
              msg.reply(`Error: ${e.message}`)
            }
          } else {
            msg.reply("You don't have a permission!")
          }
      }
    }
  }
}
main()
