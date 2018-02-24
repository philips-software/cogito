"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var delay = require('./delay');

var Poller =
/*#__PURE__*/
function () {
  function Poller(_ref) {
    var pollFunction = _ref.pollFunction,
        _ref$retries = _ref.retries,
        retries = _ref$retries === void 0 ? 10 : _ref$retries,
        _ref$interval = _ref.interval,
        interval = _ref$interval === void 0 ? 100 : _ref$interval;

    _classCallCheck(this, Poller);

    this.pollFunction = pollFunction;
    this.retries = retries;
    this.interval = interval;
    this.waiting = [];
    this.currentAttempt = 0;
  }

  _createClass(Poller, [{
    key: "poll",
    value: function () {
      var _poll = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var alreadyPolling, expiry, promise;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                alreadyPolling = this.waiting.length > 0;
                expiry = this.currentAttempt + this.retries;
                promise = new Promise(function (resolve, reject) {
                  _this.waiting.push({
                    resolve: resolve,
                    reject: reject,
                    expiry: expiry
                  });
                });

                if (!alreadyPolling) {
                  this.attempt();
                }

                return _context.abrupt("return", promise);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function poll() {
        return _poll.apply(this, arguments);
      };
    }()
  }, {
    key: "attempt",
    value: function () {
      var _attempt = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
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

                return _context2.abrupt("return");

              case 3:
                _context2.prev = 3;
                this.currentAttempt += 1;
                _context2.next = 7;
                return this.pollFunction();

              case 7:
                result = _context2.sent;
                _context2.next = 13;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](3);
                this.waiting.shift().reject(_context2.t0);

              case 13:
                if (result) {
                  this.waiting.shift().resolve(result);
                }

                _context2.next = 16;
                return delay(this.interval);

              case 16:
                return _context2.abrupt("return", this.attempt());

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 10]]);
      }));

      return function attempt() {
        return _attempt.apply(this, arguments);
      };
    }()
  }]);

  return Poller;
}();

module.exports = Poller;