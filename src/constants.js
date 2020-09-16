import 'dotenv/config';
const { SLACK_TOKEN, SLACK_SIGNING_SECRET } = process.env;

/* Initialize Slack WebClient */
//import { WebClient } from '@slack/web-api';
//export const wc = new WebClient(process.env.SLACK_TOKEN);

/* Initialize Slack Events API */
//import { createEventAdapter } from '@slack/events-api';
//export const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

/* Initialize Bolt.js */

import { App } from '@slack/bolt';

export const app = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_TOKEN
});

/* Manually banned word combos that would otherwise fit in the regex */
export const bannedCombos = [
  'hot nut',
  'shrek nut',
  'hickey nut',
  'crap nut',
  'hoe nut'
];

/* Regex for "Next hack night" alternates */
export const hackNightRegex = /next ((?:s?hr?|cr|u|o)(?:e|a|i|o|u)?c?o?w?(?:k|c|p|t|oo?|u(?:t|p)?)(?:e|a)?(?:s|y|lacka)?(?:\s|-)?(?:n|b)?(?:e|i|oo?|a)?u?(?:k|w|g|c|o|t)?k?a?(?:ey|ht|ky|e|t|wu|o(?:p|t)?|lacka))/i;
/* Regex to force a Channel Topic update */
export const forceTopicUpdateRegex = /forceChannelUpdate/gi;
