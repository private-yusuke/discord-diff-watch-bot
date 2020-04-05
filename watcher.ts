import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import * as diff from 'diff'
import moment from 'moment'

interface WatchTarget {
  url: string
  selector?: string
}
interface ContentWithDate {
  content: string
  date: moment.Moment
}
interface DiffWithTarget {
  d: string
  target: WatchTarget
}
export default class Watcher {
  watchTargets: WatchTarget[]
  contents: Map<WatchTarget, ContentWithDate>
  interval: moment.Duration
  intervalObj: NodeJS.Timer
  onDiff: ((d: DiffWithTarget) => void) | undefined

  constructor(watchTargets: WatchTarget[], interval: moment.Duration) {
    this.watchTargets = watchTargets
    this.contents = new Map()
    this.interval = interval
    this.intervalObj = setInterval(() => {
      this.watchTargets.forEach(async (target) => {
        const d = await this.diff(target)
        if (d && this.onDiff) {
          this.onDiff(d)
        }
      })
    }, this.interval.asMilliseconds())
    this.initialize()
  }
  async initialize(): Promise<void> {
    await Promise.all(this.watchTargets.map((target) => this.diff(target)))
    console.log('init done!')
    console.log(`currently watching ${this.contents.size} targets(s):`)
    console.log(Array.from(this.contents.keys()))
  }

  async diff(target: WatchTarget): Promise<DiffWithTarget | undefined> {
    const f = await fetch(target.url)
    let content = await f.text()
    if (target.selector) {
      const dom = new JSDOM(content)
      const elements = dom.window.document.querySelectorAll(target.selector)
      content = Array.from(elements)
        .map((e) => e.outerHTML)
        .join('\n')
    }
    const current = { content: content, date: moment() }
    const old = this.contents.get(target)
    if (!old) {
      this.contents.set(target, current)
      return
    }
    if (current.content != old.content) {
      this.contents.set(target, current)
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
        target: target,
      } as DiffWithTarget
    }
  }
}
