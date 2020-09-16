"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils.js");

var _constants = require("./constants.js");

/* Bring in utils */

/* Bring in constants */

/* Bring in env vars */

/**
 * Listener for new messages to the bot calling for "next hack night"
 */
_constants.app.message(_constants.hackNightRegex, _utils.sendTimeMessage);
/* Listen for messages calling for a forced update */


_constants.app.message(_constants.forceTopicUpdateRegex, _utils.forceTopicUpdate);

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _constants.app.start(3000);

        case 2:
          console.log('started');

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();
//# sourceMappingURL=app.js.map