# discord-diff-watch-bot

Discord 上で動作する、指定したウェブサイトの更新を検知したら通知するボットです。

A bot that runs on Discord and notifies you when it detects an update on a specific website.

[English version is here](README.md)

## インストール

このコマンド列は Unix 系の OS を想定しています。

1. `$ git clone https://github.com/private-yusuke/discord-diff-watch-bot`
2. `$ cp config-sample.json config.json`
3. `$ nano config.json`
   - replace `token` with your token.
4. `$ npm install`
5. `$ npm run build`
6. `$ node built/`

### Windows をお使いの方

Node.js をインストールしておいてください。

1. このリポジトリを、Download ボタンを押してダウンロードします。
2. zip ファイルを解凍します。
3. 中にある `config-sample.json` を `config.json` としてコピーします。
4. お使いのテキストエディタ（notepad.exe などで ok）を使い、 `config.json` を編集します。（詳細は後で）
5. `cmd.exe` を起動し、`cd`までタイプしてからこのプログラムのフォルダを黒い画面にドラッグアンドドロップします。
   - `cd C:¥Users¥...` みたいになれば良い
6. ここからは全て黒い画面に打ってほしいんですが、 `npm install` を実行します。（ちょっと時間がかかる）
7. `npm run build` を実行します。これがうまく行けば準備完了です。
   - ここまでで処理中に `ENOENT: no such file or directory` 等のエラーが出た場合は、5.をやり直してみてください。
8. `node built/` を実行します。うまくできれば、サイトに更新があったとき通知が飛びます。

## Settings

これらの設定は、 `config.json` を書き換えることで変更できます。

**注意**: 設定を変えるときは、まず `/config.json` を書き換えてから `$ npm run build` を実行してください。（このコマンドが `built/config.json` に対して `/config.json` の内容をコピーするため）

- `WatchInterval`
  - `unit` 単位を指定します。 (seconds, minutes, hours, days, ……)
  - `"value": 2, "unit": "minutes"` → 2 分に 1 回
- `watchURLs` 監視対象の URL を指定します。
- `watchTargets`
  - `url` 監視対象の URL を指定します。
  - `selector` どの要素を監視するか指定します。
- `discord`
  - `token` [ここ](https://discordapp.com/developers/applications)で作った bot の token を指定します。
  - `channels` 通知を配信するチャンネルの ID を指定します。
  - `motd` 起動時に起動メッセージを配信するか指定します。(🇯🇵)
  - `threshold` 省略しないで Discord に配信する文字数を指定します。

---

Issue や Pull Request は大歓迎！気づいたことがあれば、ぜひ積極的に教えてください。
We appreciate your issues and pull requests! If you have noticed something, please tell me asap.

Twitter: [@public_yusuke](https://twitter.com/public_yusuke)
