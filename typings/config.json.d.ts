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
  }
  interface Config {
    watchInterval: Duration
    watchURLs: string[]
    discord: DiscordConfig
  }

  const value: Config
  export = value
}
