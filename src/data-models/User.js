import { deathsSinceLastTweet } from '../calculate.js'
import { timeAgo } from '../utils/timeUtils.js'

class User {
  constructor({ username, timestamp } = {}) {
    this.username = username
    this.lastTweetTimestamp = timestamp

    // Track timestamp of last reply, as we might not want to needlessly spam Twitter
    this.ourLastReplyTimestamp = null
  }

  get mostRecentTweet() {
    return this.lastTweetTimestamp
  }

  set mostRecentTweet(timestamp) {
    if (!this.lastTweetTimestamp || timestamp > this.lastTweetTimestamp) {
      this.lastTweetTimestamp = timestamp
    }
  }

  calcRelativeTimeDiff(timestamp) {
    if (!this.lastTweetTimestamp) {
      return ''
    }

    const seconds = timestamp - this.lastTweetTimestamp
    return timeAgo(seconds)
  }

  calcDeathsFromInaction(timestamp) {
    if (!this.lastTweetTimestamp) {
      return 0
    }

    return deathsSinceLastTweet(this.lastTweetTimestamp, timestamp)
  }
}

export default User
