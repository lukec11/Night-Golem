const { WebClient } = require("@slack/web-api");
const wc = new WebClient(process.env.SLACK_TOKEN);

const { createEventAdapter } = require("@slack/events-api");
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const hackNightRegex = /next ((?:s?hr?|cr|u|o)(?:e|a|i|o|u)?c?o?w?(?:k|c|p|t|oo?|u(?:t|p)?)(?:e|a)?(?:s|y|lacka)?(?:\s|-)?(?:n|b)?(?:e|i|oo?|a)?u?(?:k|w|g|c|o|t)?k?a?(?:ey|ht|ky|e|t|wu|o(?:p|t)?|lacka))/gi;
const forceTopicUpdateRegex = /forceChannelUpdate/gi;

const bannedCombos = [
  'hot nut',
  'shrek nut',
  'hickey nut'
  ]

/**
 * Checks whether $n is between $start and $end, inclusive.
 * @param {int} n - number to compare
 * @param {int} start - minimum possible value
 * @param {int} end - maximum possible value
 */
const inRange = (n, start, end) => {
  return (n - start) * (n - end) <= 0;
};

/**
 * Sets the time of $date with the values of $hours, $minutes, and $seconds
 * @param {Date} date - Date to set
 * @param {int} hours
 * @param {int} minutes
 * @param {int} seconds
 */
const setTime = (date, hours, minutes, seconds) => {
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
};

/**
 * Takes a Date and returns a unix timestamp in seconds.
 * @param {Date} ts - the Date object
 */
const getSeconds = (ts) => {
  return (ts.getTime() / 1000).toFixed(0);
};

/**
 * Gathers the date of the next hack night.
 */
const nextDate = () => {
  const d = new Date();
  const today = new Date(Date.now()).getDay();

  // Checks which hack night is the next one. This code looks obfuscated, but rest assured - it's just bad.
  if (inRange(today, 0, 3)) {
    d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + 3) % 7)); //sets to the date of the next wednesday
    setTime(d, 19, 30, 0);
  } else if (inRange(today, 4, 6)) {
    d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + 6) % 7)); //sets to the date of the next saturday
    setTime(d, 24, 30, 0);
  }
  return getSeconds(d);
};

/**
 * Sends a public reply with the content $message.
 * @param {Event} event - the event recieved from slack
 * @param {String} message - the message you wish to return to the channel
 */
const sendPublicReply = async (event, message) => {
  await wc.chat.postMessage({
    channel: event.channel,
    token: process.env.SLACK_TOKEN,
    text: message,
    thread_ts: event.ts,
  });
};

/**
 * Send an emote reaction
 * @param {Event} event - the received slack event
 * @param {String} reaction - the reaction you would like sent as a response
 */
const sendReaction = async (event, reaction) => {
  await wc.reactions.add({
    token: process.env.SLACK_TOKEN,
    channel: event.channel,
    name: reaction,
    timestamp: event.ts,
  });
};

/**
 * Sets the topic of a channel
 * @param {String} channel - the channel the topic should be set for
 * @param {String} text - the text of the topic, including (potentially unsupported) formatting
 */
const setTopic = async (channel, text) => {
  await wc.conversations.setTopic({
    token: process.env.SLACK_TOKEN,
    channel: channel,
    topic: text,
  });
};

/**
 * Deletes a message based on channel and ts
 * @param {String} channel - channel of the message
 * @param {String} ts - full timestamp of the message
 */
const deleteMessage = async (channel, ts) => {
  await wc.chat.delete({
    token: process.env.ADMIN_TOKEN,
    channel: channel,
    ts: ts,
  });
};

/**
 * Listens for incoming messages with the correct keyword trigger.
 */
slackEvents.on("message", async (event) => {
  try {
    if (event.hasOwnProperty("username")) {
      if (event.username.includes("Night Golem")) {
        throw "OtherNightGolemError";
      }
    } if (
      event.text.match(hackNightRegex) &&
      !event.text.includes("thanks for joining us at Hack Night")
    ) {
      let textMatch = hackNightRegex.exec(event.text);
      if (bannedCombos.includes(textMatch.toLowerCase())) {
        const message = `<@${event.user}>, let's keep this space friendly.`;
        await sendPublicReply(event, message);
        throw 'UserBanned'
      }
      const nextHackNight = nextDate();
      const message = `The next _${textMatch[1]}_ is *<!date^${nextHackNight}^{date_short_pretty}|date>*, at *<!date^${nextHackNight}^{time}|time>* local time!`;

      await sendPublicReply(event, message);
    }
    if (event.text.match(forceTopicUpdateRegex)) {
      const nextHackNight = nextDate();
      await setTopic(
        process.env.HACK_NIGHT_CHANNEL,
        `<https://hack.af/night|Join call:> <https://hack.af/night>. The next call is *<!date^${nextHackNight}^{date_short_pretty} at {time}|date>* your time. Meet some new people, build something cool, talk about it.`
      );
    } else if (event.text.includes("set the channel topic: ")) {
      await deleteMessage(event.channel, event.ts);
    }
  } catch (err) {
    console.error(err);
  }
});

/**
 * Listens for errors from slack and sends to console
 */
slackEvents.on("error", console.error);

/**
 * Run the server
 */
slackEvents.start(process.env.PORT).then(() => {
  console.log(`listening on ${process.env.PORT}!`);
});
