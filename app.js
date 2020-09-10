/* Bring in utils */
const {
  deleteMessage,
  checkTopicUpdate,
  genTimeMessage
} = require('./utils.js');

/* Bring in constants */
const {
  slackEvents,
  forceTopicUpdateRegex,
  hackNightRegex
} = require('./constants.js');

/* Bring in env vars */
const { BOT_USER_ID, PORT } = process.env;

/**
 * Listens for incoming messages with the correct keyword trigger.
 */
slackEvents.on('message', async (event) => {
  try {
    /* Check if it's the zap golem and ignore it */
    if (event.hasOwnProperty('username')) {
      if (event.username.includes('Night Golem')) {
        console.debug('Found zap golem!');
        return;
      }
    }
    /* Don't respond to messages setting channel/group topic */
    if (event.hasOwnProperty('subtype')) {
      if (event.subtype === ('channel_topic' || 'group_topic')) {
        console.debug('Not responding to a topic change message.');
        return;
      }
    }

    /* Delete channel topic setting messages */
    if (event.text.includes(`<@${BOT_USER_ID}> set the channel's topic:`)) {
      console.debug('Deleting topic change message');
      await deleteMessage(event.channel, event.ts);
    }

    /* Check for channel topic update requests */
    if (event.text.match(forceTopicUpdateRegex)) {
      console.debug('Updating the channel topic');
      await checkTopicUpdate(event);
    }

    /* Check for message time request logic */
    if (event.text.match(hackNightRegex)) {
      console.debug('Generating Response Message');
      await genTimeMessage(event);
    }
  } catch (err) {
    console.error(err);
  }
});

/**
 * Listens for errors from slack and send to console
 */
slackEvents.on('error', console.error);

/**
 * Run the server
 */
slackEvents.start(PORT).then(() => {
  console.log(`listening on ${PORT}!`);
});
