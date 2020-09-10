require('dotenv').config();

/* Initialize Slack WebClient */
const { WebClient } = require('@slack/web-api');
const wc = new WebClient(process.env.SLACK_TOKEN);

/* Initialize Slack Events API */
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

/* Manually banned word combos that would otherwise fit in the regex */
const bannedCombos = [
  'hot nut',
  'shrek nut',
  'hickey nut',
  'crap nut',
  'hoe nut'
];

/* Regex for "Next hack night" alternates */
const hackNightRegex = /next ((?:s?hr?|cr|u|o)(?:e|a|i|o|u)?c?o?w?(?:k|c|p|t|oo?|u(?:t|p)?)(?:e|a)?(?:s|y|lacka)?(?:\s|-)?(?:n|b)?(?:e|i|oo?|a)?u?(?:k|w|g|c|o|t)?k?a?(?:ey|ht|ky|e|t|wu|o(?:p|t)?|lacka))/i;
/* Regex to force a Channel Topic update */
const forceTopicUpdateRegex = /forceChannelUpdate/gi;

module.exports = {
  wc,
  slackEvents,
  bannedCombos,
  hackNightRegex,
  forceTopicUpdateRegex
};
