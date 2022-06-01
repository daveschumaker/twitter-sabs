import { DEATHS_PER_YEAR, SEC_PER_YEAR } from '../config.js'

export const secondsPerShooting = () => {
  return Math.floor(SEC_PER_YEAR / DEATHS_PER_YEAR)
}

export const secondsBetweenTweets = (
  timestampLastTweet,
  currentTweetTimestamp
) => {
  if (!timestampLastTweet) {
    return 0
  }

  const currentTimestamp =
    currentTweetTimestamp || Math.floor(Date.now() / 1000)

  return currentTimestamp - timestampLastTweet
}

export const deathsSinceLastTweet = (timestampLastTweet, currentTimestamp) => {
  const secondsPer = secondsPerShooting()
  const secondsSince = secondsBetweenTweets(
    timestampLastTweet,
    currentTimestamp
  )

  if (!timestampLastTweet || !secondsPer) {
    return 0
  }

  return Math.floor(secondsSince / secondsPer)
}
