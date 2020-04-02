# discord-diff-watch-bot

Discord 上で動作する、指定したウェブサイトの更新を検知したら通知するボットです。

A bot that runs on Discord and notifies you when it detects an update on a specific website.

[日本語版の説明はこちらです。](README-ja.md)

## Install

1. `$ git clone https://github.com/private-yusuke/discord-diff-watch-bot`
2. `$ cp config-sample.json config.json`
3. `$ nano config.json`
   - replace `token` with your token.
4. `$ npm install`
5. `$ npm run build`
6. `$ node built/`

## Settings

These settings can be changed by modifying `config.json`.

**Note**: You should first modify `/config.json` then run `$ npm run build` since this configuration file is copied to `built/config.json` by tsc.

- `WatchInterval`
  - `unit` Specify the unit. (seconds, minutes, hours, days, ……)
  - `"value": 2, "unit": "minutes"` → 2 minutes
- `watchURLs` Specify the URL to be monitored.
- `discord`
  - `token` Specify the token of the bot you created [here](https://discordapp.com/developers/applications).
  - `channels` Specify the channel ids.
  - `motd` Whether or not to post a startup message. (🇯🇵)
  - `threshold` Specify how many characters to post to Discord without omission.

---

Issue や Pull Request は大歓迎！気づいたことがあれば、ぜひ積極的に教えてください。
We appreciate your issues and pull requests! If you have noticed something, please tell me asap.

Twitter: [@public_yusuke](https://twitter.com/public_yusuke)
