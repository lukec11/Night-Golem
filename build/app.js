'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator')
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
);

var _utils = require('./utils.js');

var _constants = require('./constants.js');

/* Bring in utils */

/* Bring in constants */

/* Bring in env vars */
var _process$env = process.env,
  BOT_USER_ID = _process$env.BOT_USER_ID,
  PORT = _process$env.PORT;
/**
 * Listens for incoming messages with the correct keyword trigger.
 */

_constants.slackEvents.on(
  'message',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2['default'])(
      /*#__PURE__*/ _regenerator['default'].mark(function _callee(event) {
        return _regenerator['default'].wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.prev = 0;

                  if (!event.hasOwnProperty('username')) {
                    _context.next = 5;
                    break;
                  }

                  if (!event.username.includes('Night Golem')) {
                    _context.next = 5;
                    break;
                  }

                  console.debug('Found zap golem!');
                  return _context.abrupt('return');

                case 5:
                  if (!event.hasOwnProperty('subtype')) {
                    _context.next = 17;
                    break;
                  }

                  if (!(event.subtype === ('channel_topic' || 'group_topic'))) {
                    _context.next = 14;
                    break;
                  }

                  if (!(event.user === BOT_USER_ID)) {
                    _context.next = 12;
                    break;
                  }

                  console.debug('Found golem channel topic message, deleting!');
                  _context.next = 11;
                  return (0, _utils.deleteMessage)(event.channel, event.ts);

                case 11:
                  return _context.abrupt('return');

                case 12:
                  console.debug('Not responding to a topic change message.');
                  return _context.abrupt('return');

                case 14:
                  if (
                    !(event.subtype === ('message_deleted' || 'message_edited'))
                  ) {
                    _context.next = 17;
                    break;
                  }

                  console.debug('Not responding to an edited/deleted message');
                  return _context.abrupt('return');

                case 17:
                  if (!event.text.match(_constants.forceTopicUpdateRegex)) {
                    _context.next = 21;
                    break;
                  }

                  console.debug('Updating the channel topic');
                  _context.next = 21;
                  return (0, _utils.checkTopicUpdate)(event);

                case 21:
                  if (!event.text.match(_constants.hackNightRegex)) {
                    _context.next = 25;
                    break;
                  }

                  console.debug('Generating Response Message');
                  _context.next = 25;
                  return (0, _utils.genTimeMessage)(event);

                case 25:
                  _context.next = 30;
                  break;

                case 27:
                  _context.prev = 27;
                  _context.t0 = _context['catch'](0);
                  console.error(_context.t0);

                case 30:
                case 'end':
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[0, 27]]
        );
      })
    );

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })()
);
/**
 * Listens for errors from slack and send to console
 */

_constants.slackEvents.on('error', console.error);
/**
 * Run the server
 */

_constants.slackEvents.start(PORT).then(function () {
  console.log('listening on '.concat(PORT, '!'));
});
//# sourceMappingURL=app.js.map
