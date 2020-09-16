"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topicUpdateRegex = exports.forceTopicUpdateRegex = exports.hackNightRegex = exports.bannedCombos = exports.app = void 0;

require("dotenv/config");

var _bolt = require("@slack/bolt");

var _process$env = process.env,
    SLACK_TOKEN = _process$env.SLACK_TOKEN,
    SLACK_SIGNING_SECRET = _process$env.SLACK_SIGNING_SECRET;
/* Initialize Bolt.js */

var app = new _bolt.App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_TOKEN,
  ignoreSelf: false
});
/* Manually banned word combos that would otherwise fit in the regex */

exports.app = app;
var bannedCombos = ['hot nut', 'shrek nut', 'hickey nut', 'crap nut', 'hoe nut'];
/* Regex for "Next hack night" alternates */

exports.bannedCombos = bannedCombos;
var hackNightRegex = /next ((?:s?hr?|cr|u|o)(?:e|a|i|o|u)?c?o?w?(?:k|c|p|t|oo?|u(?:t|p)?)(?:e|a)?(?:s|y|lacka)?(?:\s|-)?(?:n|b)?(?:e|i|oo?|a)?u?(?:k|w|g|c|o|t)?k?a?(?:ey|ht|ky|e|t|wu|o(?:p|t)?|lacka))/i;
/* Regex to force a Channel Topic update */

exports.hackNightRegex = hackNightRegex;
var forceTopicUpdateRegex = /forceChannelUpdate/gi;
/* Regex for the bot's channel topic update message */

exports.forceTopicUpdateRegex = forceTopicUpdateRegex;
var topicUpdateRegex = /<@([A-Z0-9]+)> set the channel's topic:/;
exports.topicUpdateRegex = topicUpdateRegex;
//# sourceMappingURL=init.js.map