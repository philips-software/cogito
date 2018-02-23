var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var delay = require('./delay');

var Poller = function () {
  function Poller(_ref) {
    var pollFunction = _ref.pollFunction,
        _ref$retries = _ref.retries,
        retries = _ref$retries === undefined ? 10 : _ref$retries,
        _ref$interval = _ref.interval,
        interval = _ref$interval === undefined ? 100 : _ref$interval;

    _classCallCheck(this, Poller);

    this.pollFunction = pollFunction;
    this.retries = retries;
    this.interval = interval;
    this.waiting = [];
    this.currentAttempt = 0;
  }

  _createClass(Poller, [{
    key: 'poll',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var alreadyPolling, expiry, promise;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                alreadyPolling = this.waiting.length > 0;
                expiry = this.currentAttempt + this.retries;
                promise = new Promise(function (resolve, reject) {
                  _this.waiting.push({ resolve: resolve, reject: reject, expiry: expiry });
                });

                if (!alreadyPolling) {
                  this.attempt();
                }
                return _context.abrupt('return', promise);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function poll() {
        return _ref2.apply(this, arguments);
      }

      return poll;
    }()
  }, {
    key: 'attempt',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                while (this.waiting[0] && this.waiting[0].expiry <= this.currentAttempt) {
                  this.waiting.shift().resolve(null);
                }

                if (!(this.waiting.length === 0)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return');

              case 3:
                result = void 0;
                _context2.prev = 4;

                this.currentAttempt += 1;
                _context2.next = 8;
                return this.pollFunction();

              case 8:
                result = _context2.sent;
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](4);

                this.waiting.shift().reject(_context2.t0);

              case 14:
                if (result) {
                  this.waiting.shift().resolve(result);
                }
                _context2.next = 17;
                return delay(this.interval);

              case 17:
                return _context2.abrupt('return', this.attempt());

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 11]]);
      }));

      function attempt() {
        return _ref3.apply(this, arguments);
      }

      return attempt;
    }()
  }]);

  return Poller;
}();

module.exports = Poller;