import User from './data-models/User.js'
import { generateMessage } from './message.js'
import { calcSecondsDiff } from '../src/utils/timeUtils.js'
import {
  initTwitterClient,
  fetchListTweets,
  getRateLimits,
  postTweet
} from './api/twitter.js'
import { logger } from './utils/logger.js'

initTwitterClient()
getRateLimits()

// Prevent firing off replies when server boots up and tweets are ingested into system.
let initialLoad = true

const userDictionary = {}

const parseTweets = (data = []) => {
  if (Array.isArray(data) && data.length === 0) {
    return
  }

  logger(`Number of tweets found: ${data.length}`)

  // Temporarily reverse order of tweets
  data.reverse() // Temporarily reverse array

  data.forEach((tweet) => {
    const { id, username, text, timestamp } = tweet

    // Ignore retweets
    if (text.startsWith('RT ')) {
      return
    }

    if (!userDictionary[username]) {
      userDictionary[username] = new User({ username, timestamp })
    }

    const deaths = userDictionary[username].calcDeathsFromInaction(timestamp)
    const timeAgo = userDictionary[username].calcRelativeTimeDiff(timestamp)
    userDictionary[username].mostRecentTweet = timestamp

    if (!initialLoad) {
      logger(`New tweet from @${username}:\n${text}`)
    }

    const timeDiffSincePost = calcSecondsDiff(timestamp)

    if (timeDiffSincePost < 15 && deaths > 3 && !initialLoad) {
      const msg = generateMessage({
        username: `@${username}`,
        timeAgo,
        deaths
      })

      logger(`Generating reply for tweet_id ${id} by @${username}:\n${msg}\n--`)

      postTweet({
        status: msg,
        idForReplyTweet: id
      })
    }
  })

  if (initialLoad) {
    // Timeout to enable posting of tweets.
    // Helpful in case of endless service crash / reboot.
    setTimeout(() => {
      logger('Initial load complete')
      initialLoad = false
    }, 30000)
  }
}

logger('--- SABS is online ---')
logger('Loading initial tweets')
fetchListTweets({ count: 800 }).then((res) => parseTweets(res))

// For fetching lists, we can fetch up to 1x per second.
setInterval(() => {
  logger(`--- Fetching latest tweets ---`)
  fetchListTweets().then((res) => parseTweets(res))
}, 2000)

// Periodically fetch rate limits
setInterval(() => {
  getRateLimits()
}, 60000)
