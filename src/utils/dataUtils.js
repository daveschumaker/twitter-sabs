// If the Twitter API only returns 1 tweet, it returns an object,
// otherwise, it returns an array. This casts data to array
// for easier parsing throughout app.
export const castToArray = (tweets) => {
  if (Array.isArray(tweets)) {
    return tweets
  }

  if (!Array.isArray(tweets) && tweets) {
    return [tweets]
  }

  return []
}
