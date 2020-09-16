/* Bring in utils */
import { sendTimeMessage, forceTopicUpdate } from './utils.js';

/* Bring in constants */
import { app, forceTopicUpdateRegex, hackNightRegex } from './init.js';

/**
 * Listener for new messages to the bot calling for "next hack night"
 */
app.message(hackNightRegex, sendTimeMessage);
/* Listen for messages calling for a forced update */
app.message(forceTopicUpdateRegex, forceTopicUpdate);

(async () => {
  await app.start(3000);
  console.log('started');
})();
