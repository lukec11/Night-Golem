/* Bring in utils */
import {
  sendTimeMessage,
  forceTopicUpdate,
  checkTopicUpdater
} from './utils.js';

/* Bring in constants */
import {
  app,
  forceTopicUpdateRegex,
  hackNightRegex,
  topicUpdateRegex
} from './init.js';

// app.use(async ({ payload, next }) => {
//   console.log('f');
//   console.log(payload);
//   await next();
// });

/* Use bolt's subtype middleware */

/* Listen for messages calling "next hack night" */
app.message(hackNightRegex, sendTimeMessage);
/* Listen for messages calling for a forced update */
app.message(forceTopicUpdateRegex, forceTopicUpdate);
/* Listen for a topic update message */
app.message(topicUpdateRegex, checkTopicUpdater);

/* Listen for errors */
app.error((err) => {
  console.error(err);
});

(async () => {
  await app.start(3000);
  console.log('started');
})();
