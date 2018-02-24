"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AccountsProvider =
/*#__PURE__*/
function () {
  function AccountsProvider(_ref) {
    var telepathChannel = _ref.telepathChannel;

    _classCallCheck(this, AccountsProvider);

    this.channel = telepathChannel;
  }

  _createClass(AccountsProvider, [{
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(payload, callback) {
        var error, result, request, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                request = {
                  method: 'accounts',
                  id: payload.id,
                  jsonrpc: '2.0'
                };
                _context.next = 4;
                return this.channel.send(request);

              case 4:
                response = _context.sent;
                result = {
                  jsonrpc: '2.0',
                  result: response.result,
                  id: payload.id
                };
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                error = _context.t0;

              case 11:
                callback(error, result);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      return function send(_x, _x2) {
        return _send.apply(this, arguments);
      };
    }()
  }]);

  return AccountsProvider;
}();

module.exports = AccountsProvider;