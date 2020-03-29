import fetch from 'node-fetch'
import * as diff from 'diff'
import moment from 'moment'

interface ContentWithDate {
  content: string
  date: moment.Moment
}
interface DiffWithURL {
  d: string
  url: string
}
export default class Watcher {
  watchURLs: string[]
  contents: Map<string, ContentWithDate>
  interval: moment.Duration
  intervalObj: NodeJS.Timer
  onDiff: ((d: DiffWithURL) => void) | undefined

  constructor(watchURLs: string[], interval: moment.Duration) {
    this.watchURLs = watchURLs
    this.contents = new Map()
    this.interval = interval
    this.intervalObj = setInterval(() => {
      this.watchURLs.forEach(async (url) => {
        const d = await this.diffURL(url)
        if (d && this.onDiff) {
          this.onDiff(d)
        }
      })
    }, this.interval.asMilliseconds())
    this.initialize()
  }
  async initialize(): Promise<void> {
    await Promise.all(this.watchURLs.map((url) => this.diffURL(url)))
    console.log('init done!')
    console.log(`currently watching ${this.contents.size} url(s):`)
    console.log(Array.from(this.contents.keys()))
  }

  async diffURL(url: string): Promise<DiffWithURL | undefined> {
    const f = await fetch(url)
    const current = { content: await f.text(), date: moment() }
    const old = this.contents.get(url)
    if (!old) {
      this.contents.set(url, current)
      return
    }
    if (current.content != old.content) {
      this.contents.set(url, current)
      const d = diff.createTwoFilesPatch(
        'outdated',
        'current',
        old.content,
        current.content,
        old.date.format('YYYY-MM-DD HH:mm:ss'),
        current.date.format('YYYY-MM-DD HH:mm:ss'),
      )
      return {
        d: d,
        url: url,
      } as DiffWithURL
    }
  }
}
