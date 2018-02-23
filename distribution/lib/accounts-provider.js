'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountsProvider = function () {
  function AccountsProvider(_ref) {
    var telepathChannel = _ref.telepathChannel;

    _classCallCheck(this, AccountsProvider);

    this.channel = telepathChannel;
  }

  _createClass(AccountsProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payload, callback) {
        var error, result, request, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                error = void 0, result = void 0;
                _context.prev = 1;
                request = { method: 'accounts', id: payload.id, jsonrpc: '2.0' };
                _context.next = 5;
                return this.channel.send(request);

              case 5:
                response = _context.sent;

                result = { jsonrpc: '2.0', result: response.result, id: payload.id };
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](1);

                error = _context.t0;

              case 12:
                callback(error, result);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 9]]);
      }));

      function send(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }]);

  return AccountsProvider;
}();

module.exports = AccountsProvider;