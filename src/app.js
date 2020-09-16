/* Bring in utils */
import { sendTimeMessage, forceTopicUpdate } from './utils.js';

/* Bring in constants */
import { app, forceTopicUpdateRegex, hackNightRegex } from './init.js';

/* Listen for messages calling "next hack night" */
app.message(hackNightRegex, sendTimeMessage);
/* Listen for messages calling for a channel topic update */
app.message(forceTopicUpdateRegex, forceTopicUpdate);

(async () => {
  await app.start(3000);
  console.log('started');
})();
