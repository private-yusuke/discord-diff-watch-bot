export default interface Driver {
  name: string
  send: (content: string) => void
}
