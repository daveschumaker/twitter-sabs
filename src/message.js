export const shouldSendMessage = () => {}

// Slight change up message verbiage so it isn't so spamming / identical.
const recentVerb = (deathCount) => {
  const haveHas = deathCount === 1 ? 'has' : 'have'
  const wereWas = deathCount === 1 ? 'was' : 'were'

  const VERBS = [`${haveHas} been`, `${wereWas}`, `${wereWas} recently`]
  return VERBS[Math.floor(Math.random() * VERBS.length)]
}

const areaDescriptor = () => {
  const NEARBY = ['within', 'around', 'inside', 'in']
  return NEARBY[Math.floor(Math.random() * NEARBY.length)]
}

const actionVerb = (deathCount) => {
  const VERBS = [
    'killed by',
    'lost from',
    'taken from us by',
    deathCount === 1 ? 'a victim of' : 'victims of'
  ]
  return VERBS[Math.floor(Math.random() * VERBS.length)]
}

const lastMsgDescription = () => {
  const DESC = [
    'you last posted',
    'you last tweeted',
    'you previously tweeted',
    'your last tweet',
    'your previous tweet'
  ]
  return DESC[Math.floor(Math.random() * DESC.length)]
}

const endMessage = () => {
  const MSG = [
    // 'Do something about this.',
    'Do something.',
    'How many more?',
    // 'Do your job.',
    'Please do something.',
    // 'Shame on you.',
    'Shameful.',
    'When is it enough?',
    'When will it be enough?',
    `When do you think it's enough?`,
    'You can help fix this.',
    ''
  ]
  return MSG[Math.floor(Math.random() * MSG.length)]
}

export const generateMessage = ({ username = '', deaths, timeAgo }) => {
  if (!deaths) {
    return
  }

  const peepPerson = deaths === 1 ? 'person' : 'people'
  return `${username} Since ${lastMsgDescription()} ${timeAgo}, ${deaths} ${peepPerson} ${areaDescriptor()} the United States ${recentVerb(
    deaths
  )} ${actionVerb(deaths)} gun violence. ${endMessage()}`
}
