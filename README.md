# SABS: Stochastic Analysis of Ballistics Superfans

(Alternative project name: _Second Amendment Bullshit_)

![Screenshot](/screenshots/tweet-example-1.png)

**SABS** is an automated Twitter bot created in the wake of the [elementary school shooting in Uvalde.](https://en.wikipedia.org/wiki/Robb_Elementary_School_shooting). You can currently see it in action on Twitter at [@Ughmericana](https://twitter.com/ughmericana).

It is designed to follow a specific list and automatically reply to all new tweets. The current use case for this bot is to monitor @CSPAN's ["Members of Congress"](https://mobile.twitter.com/i/lists/34179516) list and automatically reply with facts about gun violence in the United States.

## General information

On initial load, the application fetches the most recent 150 or so tweets from the list mentioned above. It iterates through the list and injects them into a data store keyed to the username of the author for later lookup.

After around 30 seconds or so, the application is allowed to start posting (this is to prevent any spam / throttling issues if there is some sort of infinite crash loop). It begins refreshing the twitter list every 2 seconds (Twitter API lets us do it once per second, but I wanted to give a bit of leeway). Anytime a new tweet comes through, SABS checks to see if the author has already been logged.

If not, it creates a new entry in the data store for later lookup.

If we've seen previous tweets from the author, it calculates the number of potential deaths due to gun violence between the latest tweet and the most recent prior tweet. Providing certain criteria are met (i.e., as much as I would love to, we don't want to post something that says, "since you last posted, there have been 0 deaths due to gun violence..."), a POST request is sent to Twitter with instructions to reply to this specific tweet.

**Note:** Because this bot can quickly react to new tweets, our posts are usually the first one attached to the reply chain. As such, they are highly visible. Be prepared for replies to be a bit _spicey_, especially as your reply might have nothing to do with the content of the original tweet. Also, followers of some radical right congresspeople are downright crazy.

![Screenshot](/screenshots/tweet-example-2.png)

## To use

1. Clone the project to your machine: `> git clone git@github.com:daveschumaker/twitter-sabs.git`
2. `> cd ~/twitter-sabs`
3. `> npm install`
4. Create a `.env` file in the root directory of this project: `> touch .env`
5. Add relevant API keys from Twitter into `.env` file. It should look something like code block below these steps.
6. Run the project using `npm start`

### .env contents

```bash
# Twitter Application API Keys
# Created via Twitter developer portal
CONSUMER_KEY=xyz
CONSUMER_SECRET=xyz

# OAuth keys for Twitter account that will automatically post
ACCESS_TOKEN=xyz
ACCESS_SECRET=xyz

# CSPAN Members of Congress List: https://mobile.twitter.com/i/lists/34179516
TWITTER_LIST_ID=34179516
```

## TO DOs

- Separate parsing and posting logic from index.js into it's own controller.
- More flexible configuration options (e.g., timeouts, cooldown, refresh rates)
- Tests (always with the tests)
