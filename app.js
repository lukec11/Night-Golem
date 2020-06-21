const { WebClient } = require('@slack/web-api');
const wc = new WebClient(process.env.SLACK_TOKEN)

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const hackNightRegex = /next (h(?:e|a)?c?(?:k|c|oo(?:t|p))(?:\s|-)?ni?(?:ght|te|oo(?:p|t)))/gi

/**
 * Checks whether $n is between $start and $end, inclusive.
 * @param {int} n - number to compare
 * @param {int} start - minimum possible value
 * @param {int} end - maximum possible value
 */
const inRange = (n, start, end) => {
    return ((n-start)*(n-end) <= 0);
}

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
}

/**
 * Takes a Date and returns a unix timestamp in seconds.
 * @param {Date} ts - the Date object
 */
const getSeconds = (ts) => {
    return (ts.getTime() / 1000).toFixed(0);
}

/**
 * Gathers the date of the next hack night.
 */
const nextDate = () => {
    const d = new Date();
    const today = new Date(Date.now()).getDay();

    // Checks which hack night is the next one. This code looks obfuscated, but rest assured - it's just bad.
    if (inRange(today, 0, 3)) {
        d.setDate(d.getDate() + ((7-d.getDay())%7+3) % 7); //sets to the date of the next wednesday
        setTime(d, 19, 30, 0);
    }
    else if (inRange(today, 4, 6)) {
       d.setDate(d.getDate() + ((7-d.getDay())%7+6) % 7); //sets to the date of the next saturday
       setTime(d, 24, 30, 0)
    }
    return getSeconds(d);
}

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
            thread_ts: event.ts 
        })
    }

/**
 * Listens for incoming messages with the correct keyword trigger.
 */

slackEvents.on('message', event => {
    if (event.text.match(hackNightRegex) && !event.text.includes('Have a great week')) {
        let textMatch = hackNightRegex.exec(event.text)
        const nextHackNight = nextDate();
        const message = `The next _${textMatch[1]}_ is *<!date^${nextHackNight}^{date_short_pretty}|date>*, at *<!date^${nextHackNight}^{time}|time>* local time!`

        sendPublicReply(event, message)
    }
})

/**
 * Listens for errors from slack and sends to console
 */
slackEvents.on('error', console.error);

/**
 * Run the server
 */
slackEvents.start(process.env.PORT)
    .then(() => {
        console.log(`listening on ${process.env.PORT}!`);
    });
