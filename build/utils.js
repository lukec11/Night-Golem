"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkTopicUpdater = exports.forceTopicUpdate = exports.sendTimeMessage = exports.checkTopicUpdate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _init = require("./init.js");

require('dotenv').config();
/* Pull in constants */


/* Pull env vars */
var _process$env = process.env,
    SLACK_TOKEN = _process$env.SLACK_TOKEN,
    ADMIN_TOKEN = _process$env.ADMIN_TOKEN,
    HACK_NIGHT_CHANNEL = _process$env.HACK_NIGHT_CHANNEL,
    BOT_USER_ID = _process$env.BOT_USER_ID;
/**
 * Checks whether $n is between $start and $end, inclusive.
 * @param {int} n - number to compare
 * @param {int} start - minimum possible value
 * @param {int} end - maximum possible value
 */

var inRange = function inRange(n, start, end) {
  return (n - start) * (n - end) <= 0;
};
/**
 * Sets the time of $date with the values of $hours, $minutes, and $seconds
 * @param {Date} date - Date to set
 * @param {int} hours
 * @param {int} minutes
 * @param {int} seconds
 */


var setTime = function setTime(date, hours, minutes, seconds) {
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
};
/**
 * Takes a Date and returns a unix timestamp in seconds.
 * @param {Date} ts - the Date object
 */


var getSeconds = function getSeconds(ts) {
  return (ts.getTime() / 1000).toFixed(0);
};
/**
 * Check if there is currently a hack night in progress.
 */


var happeningNow = function happeningNow() {
  var now = new Date();
  var day = now.getDay();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  /* Check if today is wednesday */

  if (day === 3) {
    /* Check if current time is between 15:30 and 23:59 Eastern */
    if ((hours > 15 || hours == 15 && minutes >= 30) && (hours < 23 || hours == 23 && minutes <= 59)) {
      return true;
    }
  }
  /* Check if today is Saturday */


  if (day === 6) {
    /* Check if current time is between 20:30 and 23:59 */
    if ((hours > 20 || hours == 20 && minutes >= 30) && (hours < 23 || hours == 23 && minutes <= 59)) {
      return true;
    }
  }
  /* It's neither of these, so we'll return false. */


  return false;
};
/**
 * Gathers the date of the next hack night.
 */


var nextDate = function nextDate() {
  var d = new Date();
  var today = new Date(Date.now()).getDay();
  /* Today is Sun - Wed */

  if (inRange(today, 0, 3)) {
    d.setDate(d.getDate() + (3 + 7 - d.getDay()) % 7); // Sets to date of the next Wednesday

    setTime(d, 15, 30, 0); // Sets time to 15:30 Eastern
  } else if (inRange(today, 4, 6)) {
    /* Today is Thu - Sat */
    d.setDate(d.getDate() + (6 + 7 - d.getDay()) % 7); // Sets to date of the next Saturday

    setTime(d, 20, 30, 0); // Sets time to 20:30 Eastern
  }

  return getSeconds(d); // returns date in unix seconds (the correct format for slack)
};
/**
 * Sends a public reply with the content $message.
 * @param {Event} event - the event recieved from slack
 * @param {String} message - the message you wish to return to the channel
 */


var sendPublicReply = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event, message) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _init.app.client.chat.postMessage({
              channel: event.channel,
              token: SLACK_TOKEN,
              text: message,
              thread_ts: event.ts
            });

          case 3:
            _context.next = 8;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 5]]);
  }));

  return function sendPublicReply(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Send an emote reaction
 * @param {Event} event - the received slack event
 * @param {String} reaction - the reaction you would like sent as a response
 */


var sendReaction = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(event, reaction) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _init.app.client.reactions.add({
              token: SLACK_TOKEN,
              channel: event.channel,
              name: reaction,
              timestamp: event.ts
            });

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 5]]);
  }));

  return function sendReaction(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Sets the topic of a channel
 * @param {String} channel - the channel the topic should be set for
 * @param {String} text - the text of the topic, including (potentially unsupported) formatting
 */


var setTopic = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(channel, text) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _init.app.client.conversations.setTopic({
              token: SLACK_TOKEN,
              channel: channel,
              topic: text
            });

          case 3:
            _context3.next = 8;
            break;

          case 5:
            _context3.prev = 5;
            _context3.t0 = _context3["catch"](0);
            console.error(_context3.t0);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 5]]);
  }));

  return function setTopic(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Deletes a message based on channel and ts
 * @param {String} channel - channel of the message
 * @param {String} ts - full timestamp of the message
 */


var deleteMessage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(channel, ts) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _init.app.client.chat["delete"]({
              token: ADMIN_TOKEN,
              channel: channel,
              ts: ts
            });

          case 3:
            _context4.next = 8;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4["catch"](0);
            console.error(_context4.t0);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 5]]);
  }));

  return function deleteMessage(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var checkBan = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(event) {
    var textMatch;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            textMatch = _init.hackNightRegex.exec(event.text);

            if (!_init.bannedCombos.includes(textMatch[1].toLowerCase())) {
              _context5.next = 7;
              break;
            }

            console.debug("Refusing response to ".concat(event.user, " for ").concat(event.text, " in ").concat(event.channel, "."));
            _context5.next = 6;
            return sendPublicReply(event, "<@".concat(event.user, ">, let's keep this space friendly."));

          case 6:
            return _context5.abrupt("return", true);

          case 7:
            return _context5.abrupt("return", false);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));

  return function checkBan(_x9) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Checks an event to see if it was a channel topic update request
 * @param {Event} event
 */


var checkTopicUpdate = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(event) {
    var topic, nextHackNight;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            /* Check if Hack Night is currently happening */
            if (happeningNow()) {
              topic = "Hack Night is happening _*right now*_! :fastparrot: <https://hack.af/night|Join the fun> \u2014 Meet some new people, build something cool, talk about it! :tada:";
            } else {
              /* It's not happening right now, so set to the next possible date. */
              nextHackNight = nextDate();
              topic = ":clock4: The next <https://hackclub.com/night|Hack Night> is *<!date^".concat(nextHackNight, "^{date_short_pretty} at {time}|date>* your time. :pencil: At the last call? <https://hack.af/night|Fill out the survey>... :wave: See you soon!");
            }

            _context6.next = 4;
            return setTopic(HACK_NIGHT_CHANNEL, topic);

          case 4:
            _context6.next = 6;
            return sendReaction(event, 'heavy_check_mark');

          case 6:
            _context6.next = 11;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            console.error(_context6.t0);

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 8]]);
  }));

  return function checkTopicUpdate(_x10) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * Turns text title case
 * @param {String} str | String to make Title Cased
 */


exports.checkTopicUpdate = checkTopicUpdate;

var titleCase = function titleCase(str) {
  var split = str.toLowerCase().split(' ');

  for (var i = 0; i < split.length; i++) {
    split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
  }

  return split.join(' ');
};
/**
 * Generates a message to reply to a user
 * @param {Object} event | A bolt 'message' event to reply to
 */


var genTimeMessage = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(event) {
    var message, textMatch, nextHackNight;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return checkBan(event);

          case 3:
            if (!_context7.sent) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt("return");

          case 5:
            textMatch = event.text.match(_init.hackNightRegex);

            if (happeningNow()) {
              message = "_".concat(titleCase(textMatch[1]), "_ is happening right now, what are you still doing here!? <https://hack.af/night|Join the call!>");
            } else {
              nextHackNight = nextDate();
              message = "The next _".concat(textMatch[1], "_ is *<!date^").concat(nextHackNight, "^{date_short_pretty} at {time}|[Open Slack To View]>* your time. See you there!");
            }

            _context7.next = 9;
            return sendPublicReply(event, message);

          case 9:
            _context7.next = 14;
            break;

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7["catch"](0);
            console.error(_context7.t0);

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 11]]);
  }));

  return function genTimeMessage(_x11) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Handler function for "next hack night" messages
 * @param {Object} payload | "message" event payload from bolt
 */


var sendTimeMessage = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref8) {
    var payload;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            payload = _ref8.payload;
            _context8.prev = 1;

            if (!payload.hasOwnProperty('username')) {
              _context8.next = 6;
              break;
            }

            if (!payload.username.includes('Night Golem')) {
              _context8.next = 6;
              break;
            }

            console.debug('Found zap golem!');
            return _context8.abrupt("return");

          case 6:
            if (!payload.hasOwnProperty('subtype')) {
              _context8.next = 18;
              break;
            }

            if (!(payload.subtype === ('channel_topic' || 'group_topic'))) {
              _context8.next = 15;
              break;
            }

            if (!(payload.user === BOT_USER_ID)) {
              _context8.next = 13;
              break;
            }

            console.debug('Found golem channel topic message, deleting!');
            _context8.next = 12;
            return deleteMessage(payload.channel, payload.ts);

          case 12:
            return _context8.abrupt("return");

          case 13:
            console.debug('Not responding to a topic change message.');
            return _context8.abrupt("return");

          case 15:
            if (!(payload.subtype === ('message_deleted' || 'message_edited'))) {
              _context8.next = 18;
              break;
            }

            console.debug('Not responding to an edited/deleted message');
            return _context8.abrupt("return");

          case 18:
            _context8.next = 20;
            return genTimeMessage(payload);

          case 20:
            _context8.next = 25;
            break;

          case 22:
            _context8.prev = 22;
            _context8.t0 = _context8["catch"](1);
            console.error(_context8.t0);

          case 25:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 22]]);
  }));

  return function sendTimeMessage(_x12) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Handler function for "Force topic update" messages
 * @param {Object} payload | "message" event payload from bolt
 */


exports.sendTimeMessage = sendTimeMessage;

var forceTopicUpdate = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_ref10) {
    var payload;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            payload = _ref10.payload;
            _context9.prev = 1;
            console.debug('Updating the channel topic');
            _context9.next = 5;
            return checkTopicUpdate(payload);

          case 5:
            _context9.next = 11;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](1);
            console.error('it broke!');
            console.error(_context9.t0);

          case 11:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 7]]);
  }));

  return function forceTopicUpdate(_x13) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Checks to see whether a channel topic update was night golem
 * @param {Object} payload | "message" event payload from bolt
 */


exports.forceTopicUpdate = forceTopicUpdate;

var checkTopicUpdater = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_ref12) {
    var payload, match;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            payload = _ref12.payload;
            _context10.prev = 1;
            match = payload.text.match(_init.topicUpdateRegex);
            console.log(match);

            if (!(match[1] == BOT_USER_ID)) {
              _context10.next = 7;
              break;
            }

            _context10.next = 7;
            return deleteMessage(payload.channel, payload.ts);

          case 7:
            _context10.next = 12;
            break;

          case 9:
            _context10.prev = 9;
            _context10.t0 = _context10["catch"](1);
            console.error(_context10.t0);

          case 12:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 9]]);
  }));

  return function checkTopicUpdater(_x14) {
    return _ref13.apply(this, arguments);
  };
}();

exports.checkTopicUpdater = checkTopicUpdater;
//# sourceMappingURL=utils.js.map