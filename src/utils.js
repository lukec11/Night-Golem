require('dotenv').config();

/* Pull in constants */
import { app, bannedCombos, hackNightRegex } from './init.js';

/* Pull env vars */
const {
  SLACK_TOKEN,
  ADMIN_TOKEN,
  HACK_NIGHT_CHANNEL,
  BOT_USER_ID
} = process.env;

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
 * Check if there is currently a hack night in progress.
 */
const happeningNow = () => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  /* Check if today is wednesday */
  if (day === 3) {
    /* Check if current time is between 15:30 and 23:59 Eastern */
    if (
      (hours > 15 || (hours == 15 && minutes >= 30)) &&
      (hours < 23 || (hours == 23 && minutes <= 59))
    ) {
      return true;
    }
  }

  /* Check if today is Saturday */
  if (day === 6) {
    /* Check if current time is between 20:30 and 23:59 */
    if (
      (hours > 20 || (hours == 20 && minutes >= 30)) &&
      (hours < 23 || (hours == 23 && minutes <= 59))
    ) {
      return true;
    }
  }

  /* It's neither of these, so we'll return false. */
  return false;
};

/**
 * Gathers the date of the next hack night.
 */
const nextDate = () => {
  const d = new Date();
  const today = new Date(Date.now()).getDay();

  /* Today is Sun - Wed */
  if (inRange(today, 0, 3)) {
    d.setDate(d.getDate() + ((3 + 7 - d.getDay()) % 7)); // Sets to date of the next Wednesday
    setTime(d, 15, 30, 0); // Sets time to 15:30 Eastern
  } else if (inRange(today, 4, 6)) {
    /* Today is Thu - Sat */
    d.setDate(d.getDate() + ((6 + 7 - d.getDay()) % 7)); // Sets to date of the next Saturday
    setTime(d, 20, 30, 0); // Sets time to 20:30 Eastern
  }
  return getSeconds(d); // returns date in unix seconds (the correct format for slack)
};

/**
 * Sends a public reply with the content $message.
 * @param {Event} event - the event recieved from slack
 * @param {String} message - the message you wish to return to the channel
 */
const sendPublicReply = async (event, message) => {
  try {
    await app.client.chat.postMessage({
      channel: event.channel,
      token: SLACK_TOKEN,
      text: message,
      thread_ts: event.ts
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * Send an emote reaction
 * @param {Event} event - the received slack event
 * @param {String} reaction - the reaction you would like sent as a response
 */
const sendReaction = async (event, reaction) => {
  try {
    await app.client.reactions.add({
      token: SLACK_TOKEN,
      channel: event.channel,
      name: reaction,
      timestamp: event.ts
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * Sets the topic of a channel
 * @param {String} channel - the channel the topic should be set for
 * @param {String} text - the text of the topic, including (potentially unsupported) formatting
 */
const setTopic = async (channel, text) => {
  try {
    await app.client.conversations.setTopic({
      token: SLACK_TOKEN,
      channel: channel,
      topic: text
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * Deletes a message based on channel and ts
 * @param {String} channel - channel of the message
 * @param {String} ts - full timestamp of the message
 */
const deleteMessage = async (channel, ts) => {
  try {
    await app.client.chat.delete({
      token: ADMIN_TOKEN,
      channel: channel,
      ts: ts
    });
  } catch (err) {
    console.error(err);
  }
};

const checkBan = async (event) => {
  try {
    let textMatch = hackNightRegex.exec(event.text);
    if (bannedCombos.includes(textMatch[1].toLowerCase())) {
      console.debug(
        `Refusing response to ${event.user} for ${event.text} in ${event.channel}.`
      );
      await sendPublicReply(
        event,
        `<@${event.user}>, let's keep this space friendly.`
      );
      return true;
    }
    /* Otherwise, return false. */
    return false;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Checks an event to see if it was a channel topic update request
 * @param {Event} event
 */
export const checkTopicUpdate = async (event) => {
  try {
    let topic;
    /* Check if Hack Night is currently happening */
    if (happeningNow()) {
      topic = `Hack Night is happening _*right now*_! :fastparrot: <https://hack.af/night|Join the fun> — Meet some new people, build something cool, talk about it! :tada:`;
    } else {
      /* It's not happening right now, so set to the next possible date. */
      const nextHackNight = nextDate();
      topic = `:clock4: The next <https://hackclub.com/night|Hack Night> is *<!date^${nextHackNight}^{date_short_pretty} at {time}|date>* your time. :pencil: At the last call? <https://hack.af/night|Fill out the survey>... :wave: See you soon!`;
    }

    await setTopic(HACK_NIGHT_CHANNEL, topic);
    await sendReaction(event, 'heavy_check_mark');
  } catch (err) {
    console.error(err);
  }
};

/**
 * Turns text title case
 * @param {String} str | String to make Title Case
 */
const titleCase = (str) => {
  let split = str.toLowerCase().split(' ');
  for (let i = 0; i < split.length; i++) {
    split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
  }
  return split.join(' ');
};

/**
 * Generates a message to reply to a user
 * @param {Event} event | A slack 'message' event to reply to
 */
const genTimeMessage = async (event) => {
  try {
    /* Check if this includes banned keywords */
    if (await checkBan(event)) {
      return;
    }

    let message;
    let textMatch = event.text.match(hackNightRegex);

    if (happeningNow()) {
      message = `_${titleCase(
        textMatch[1]
      )}_ is happening right now, what are you still doing here!? <https://hack.af/night|Join the call!>`;
    } else {
      const nextHackNight = nextDate();
      message = `The next _${textMatch[1]}_ is *<!date^${nextHackNight}^{date_short_pretty} at {time}|[Open Slack To View]>* your time. See you there!`;
    }
    await sendPublicReply(event, message);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Handler function for "next hack night" messages
 * @param {Object} payload | "message" event payload from bolt
 */
export const sendTimeMessage = async ({ payload }) => {
  try {
    /* Check if it's the zap golem and ignore it */
    if (payload.hasOwnProperty('username')) {
      if (payload.username.includes('Night Golem')) {
        console.debug('Found zap golem!');
        return;
      }
    }
    /* Don't respond to messages setting channel/group topic */
    if (payload.hasOwnProperty('subtype')) {
      if (payload.subtype === ('channel_topic' || 'group_topic')) {
        /* If it's night golem's topic, delete it. */
        if (payload.user === BOT_USER_ID) {
          console.debug('Found golem channel topic message, deleting!');
          await deleteMessage(payload.channel, payload.ts);
          return;
        }
        console.debug('Not responding to a topic change message.');
        return;
      }
      if (payload.subtype === ('message_deleted' || 'message_edited')) {
        console.debug('Not responding to an edited/deleted message');
        return;
      }
    }

    /* Looks like it's fine, go ahead and post the message. */
    await genTimeMessage(payload);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Handler function for "Force topic update" messages
 * @param {Object} payload | "message" event payload from bolt
 */
export const forceTopicUpdate = async ({ payload }) => {
  console.debug('Updating the channel topic');
  await checkTopicUpdate(payload);
};
