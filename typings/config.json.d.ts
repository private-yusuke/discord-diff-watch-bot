import moment from 'moment'

declare module '*/config.json' {
  interface Duration {
    value: number
    unit: moment.unitOfTime.Base
  }
  interface DiscordConfig {
    token: string
    channels: string[]
    motd: boolean
    threshold: number
    permittedGroups: string[]
  }
  interface Config {
    watchInterval: Duration
    watchURLs: string[]
    discord: DiscordConfig
    commandPrefix: string
  }

  const value: Config
  export = value
}
