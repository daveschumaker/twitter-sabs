export const calcSecondsDiff = (timestamp) => {
  const currentTimestamp = Math.floor(Date.now() / 1000)

  if (!timestamp) {
    return 0
  }

  return currentTimestamp - timestamp
}

// Modified under MIT license via:
// https://github.com/ZeroDragon/HumanElapsed
export const timeAgo = (seconds) => {
  const ranges = {
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1
  }

  const time = Object.keys(ranges)
    .map((key) => ranges[key])
    .reduce(
      (acum, range) => {
        const latest = acum[acum.length - 1]
        acum.push({
          int: Math.floor(latest.res / range),
          res: latest.res % range
        })
        return acum
      },
      [{ int: 0, res: parseInt(seconds, 10) }]
    )
    .filter((e, i) => i !== 0)
    .map((range, index) => {
      const base = Object.keys(ranges)[index]
      const unit = range.int !== 1 ? `${base}s` : base
      return {
        unit,
        value: range.int
      }
    })
    .filter((e) => e.value > 0)
    .map((e) => `${e.value} ${e.unit}`)

  if (time.length === 1 && time[0].indexOf('second')) {
    return time[0] + ' ago'
  }

  // If there are multiple time values, strip out seconds since we don't need to be that precise.
  if (time.slice(-1).indexOf('second')) {
    time.pop()
  }

  let formatedTime

  if (time.length > 1) {
    time.splice(time.length - 1, 0, 'and')
  }

  formatedTime = time.join(', ').replace(', and,', ' and')

  return formatedTime + ' ago'
}
