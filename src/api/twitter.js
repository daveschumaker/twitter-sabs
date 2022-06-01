/* eslint-disable no-console */
import 'dotenv/config'
import Twit from 'twit'

import Tweet from '../data-models/Tweet.js'
import { castToArray } from '../utils/dataUtils.js'
import { logger } from '../utils/logger.js'

let client
let lastTimelineId

export const initTwitterClient = () => {
  client = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true // optional - requires SSL certificates to be valid.
  })

  return Promise.resolve()
}

export const fetchListTweets = ({
  listId = process.env.TWITTER_LIST_ID,
  includeRt = false,
  count = 100
} = {}) => {
  const options = {
    list_id: listId,
    include_rts: includeRt,
    count
  }

  if (lastTimelineId) {
    options.since_id = lastTimelineId
  }

  return new Promise((resolve) => {
    client.get('lists/statuses', options, (err, data) => {
      if (err) {
        console.log(`An error has occurred:`, err)
        return resolve([])
      }

      let tweetsArray = []
      const tweets = castToArray(data)

      if (Array.isArray(tweets) && tweets.length === 0) {
        return resolve([])
      } else if (!Array.isArray(tweets)) {
        return resolve([])
      }

      if (tweets[0].id_str) {
        lastTimelineId = tweets[0].id_str
      }

      tweets.forEach((tweetDetails) => {
        if (tweetDetails) {
          tweetsArray.push(new Tweet(tweetDetails))
        }
      })

      return resolve(tweetsArray)
    })
  })
}

export const getTweets = () => {
  const options = {}

  if (lastTimelineId) {
    options.since_id = lastTimelineId
  }

  client.get('statuses/home_timeline', options, (err, data) => {
    const tweets = castToArray(data)

    if (tweets[0]?.id_str) {
      lastTimelineId = tweets[0].id_str
    }

    // When there's only a single tweet, data is an object instead of an array.
    tweets.forEach((tweetDetails = {}) => {
      logger(tweetDetails)
    })
  })
}

export const getRateLimits = () => {
  // More details on fetching current rate limits here:
  // https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/rate-limit-status/api-reference/get-application-rate_limit_status
  client.get('application/rate_limit_status', (err, data = {}) => {
    const { resources = {} } = data
    const { lists, statuses } = resources

    console.log('Rate limits:')
    console.log(`[Lists]`)
    console.log(lists)
    console.log(`[Statuses]`)
    console.log(statuses)
  })
}

export const streamTweets = () => {
  //   var stream = client.stream('statuses/filter', {
  //     track: ['bananas', 'oranges', 'strawberries']
  //   })
  var stream = client.stream('statuses/sample')

  stream.on('tweet', (tweet) => {
    logger(tweet)
  })
}

let canTweet = true

export const postTweet = ({ status = '', idForReplyTweet = '' }) => {
  if (!status) {
    return
  }

  if (!idForReplyTweet) {
    return
  }

  if (!canTweet) {
    return
  }

  const options = {
    status,
    in_reply_to_status_id: idForReplyTweet
  }

  client.post('statuses/update', options, (err, data = {}) => {
    // Set cooldown so we don't inadvertantly spam the universe
    canTweet = false
    setTimeout(() => {
      canTweet = true
    }, 90)

    if (err) {
      console.log(`An error has occurred while attempting to post tweet:`, err)
      return
    }

    const { text, in_reply_to_status_id } = data

    if (text && in_reply_to_status_id) {
      logger(`Reply succesfully posted:\n"${text}"`)
    }
  })
}
