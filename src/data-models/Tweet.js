class Tweet {
  constructor({ created_at, id_str, text, user = {} } = {}) {
    this.created = created_at
    this.timestamp = Math.floor(new Date(created_at).getTime() / 1000)
    this.id = String(id_str)
    this.text = String(text)
    this.username = user.screen_name
  }
}

export default Tweet
