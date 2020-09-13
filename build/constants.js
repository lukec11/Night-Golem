"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceTopicUpdateRegex = exports.hackNightRegex = exports.bannedCombos = exports.slackEvents = exports.wc = void 0;

var _webApi = require("@slack/web-api");

var _eventsApi = require("@slack/events-api");

require('dotenv').config();
/* Initialize Slack WebClient */


var wc = new _webApi.WebClient(process.env.SLACK_TOKEN);
/* Initialize Slack Events API */

exports.wc = wc;
var slackEvents = (0, _eventsApi.createEventAdapter)(process.env.SLACK_SIGNING_SECRET);
/* Manually banned word combos that would otherwise fit in the regex */

exports.slackEvents = slackEvents;
var bannedCombos = ['hot nut', 'shrek nut', 'hickey nut', 'crap nut', 'hoe nut'];
/* Regex for "Next hack night" alternates */

exports.bannedCombos = bannedCombos;
var hackNightRegex = /next ((?:s?hr?|cr|u|o)(?:e|a|i|o|u)?c?o?w?(?:k|c|p|t|oo?|u(?:t|p)?)(?:e|a)?(?:s|y|lacka)?(?:\s|-)?(?:n|b)?(?:e|i|oo?|a)?u?(?:k|w|g|c|o|t)?k?a?(?:ey|ht|ky|e|t|wu|o(?:p|t)?|lacka))/i;
/* Regex to force a Channel Topic update */

exports.hackNightRegex = hackNightRegex;
var forceTopicUpdateRegex = /forceChannelUpdate/gi;
exports.forceTopicUpdateRegex = forceTopicUpdateRegex;
//# sourceMappingURL=constants.js.map