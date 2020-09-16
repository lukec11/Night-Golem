"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils.js");

var _init = require("./init.js");

/* Bring in utils */

/* Bring in constants */

/* Listen for messages calling "next hack night" */
_init.app.message(_init.hackNightRegex, _utils.sendTimeMessage);
/* Listen for messages calling for a channel topic update */


_init.app.message(_init.forceTopicUpdateRegex, _utils.forceTopicUpdate);

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _init.app.start(3000);

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