import { Client } from 'discord.js'
import moment from 'moment'
import Watcher from './watcher'
import config from './config.json'
import DiscordDriver from './drivers/discord'
import { Readable } from 'stream'

const driver = new DiscordDriver(config.discord.motd)
console.log('>>> Starting... <<<')
console.log(moment().toString())
console.log(config.watchInterval)

const duration = moment.duration(
  config.watchInterval.value,
  config.watchInterval.unit as never,
)
const watcher = new Watcher(config.watchURLs, duration)
watcher.onDiff = (diff) => {
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
    driver.upload(message, readable, `diff-${moment().toString()}.txt`)
  } else {
    driver.send(content)
  }
}
