import { Client } from 'discord.js'
import moment from 'moment'
import Watcher from './watcher'
import config from './config.json'
import DiscordDriver from './drivers/discord'

const driver = new DiscordDriver(config.discord.motd)
console.log(config.watchInterval)

const duration = moment.duration(
  config.watchInterval.value,
  config.watchInterval.unit as never,
)
const watcher = new Watcher(config.watchURLs, duration)
watcher.onDiff = (diff) => {
  console.debug(`diff found: ${moment().toString()} at ${diff.url}`)
  console.debug(diff.d)
  if (diff.d.length > config.discord.threshold)
    driver.send(`更新が検出されました！（差分巨大のため省略）\n${diff.url}`)
  else {
    driver.send(
      `更新が検出されました！${moment().format('YYYY-MM-DD HH:mm:ss')}\`\`\`${
        diff.d
      }\`\`\`\n${diff.url}`,
    )
  }
}
