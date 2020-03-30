import MessageLike from '../models/message-like'
import { Stream } from 'stream'

export default interface Driver {
  name: string
  send: (content: string, channel: string) => Promise<MessageLike>
  sendAll: (content: string) => Promise<MessageLike[]>
  upload: (
    content: string,
    file: string | Buffer | Stream,
    title: string,
    channel: string,
  ) => Promise<MessageLike>
  uploadAll: (
    content: string,
    file: string | Buffer | Stream,
    title: string,
  ) => Promise<MessageLike[]>
}
