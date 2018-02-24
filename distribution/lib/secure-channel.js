"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var base64url = require('base64url');

var _require = require('./crypto'),
    random = _require.random,
    encrypt = _require.encrypt,
    decrypt = _require.decrypt,
    nonceSize = _require.nonceSize;

var Poller = require('./poller');

var SecureChannel =
/*#__PURE__*/
function () {
  function SecureChannel(_ref) {
    var queuing = _ref.queuing,
        id = _ref.id,
        key = _ref.key;

    _classCallCheck(this, SecureChannel);

    this.queuing = queuing;
    this.id = id;
    this.key = key;
    this.poller = new Poller({
      pollFunction: function pollFunction() {
        return queuing.receive("".concat(id, ".blue"));
      },
      interval: 1000,
      retries: 600
    });
  }

  _createClass(SecureChannel, [{
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(message) {
        var queueId, nonce, cypherText, nonceAndCypherText;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                queueId = "".concat(this.id, ".red");
                _context.t0 = Buffer;
                _context.t1 = random;
                _context.next = 5;
                return nonceSize();

              case 5:
                _context.t2 = _context.sent;
                _context.next = 8;
                return (0, _context.t1)(_context.t2);

              case 8:
                _context.t3 = _context.sent;
                nonce = _context.t0.from.call(_context.t0, _context.t3);
                _context.t4 = Buffer;
                _context.next = 13;
                return encrypt(Buffer.from(message), nonce, this.key);

              case 13:
                _context.t5 = _context.sent;
                cypherText = _context.t4.from.call(_context.t4, _context.t5);
                nonceAndCypherText = Buffer.concat([nonce, cypherText]);
                _context.next = 18;
                return this.queuing.send(queueId, nonceAndCypherText);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function send(_x) {
        return _send.apply(this, arguments);
      };
    }()
  }, {
    key: "receive",
    value: function () {
      var _receive = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var nonceAndCypherText, nonce, cypherText;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.poller.poll();

              case 2:
                nonceAndCypherText = _context2.sent;

                if (nonceAndCypherText) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", null);

              case 5:
                _context2.t0 = nonceAndCypherText;
                _context2.next = 8;
                return nonceSize();

              case 8:
                _context2.t1 = _context2.sent;
                nonce = _context2.t0.slice.call(_context2.t0, 0, _context2.t1);
                _context2.t2 = nonceAndCypherText;
                _context2.next = 13;
                return nonceSize();

              case 13:
                _context2.t3 = _context2.sent;
                cypherText = _context2.t2.slice.call(_context2.t2, _context2.t3);
                return _context2.abrupt("return", decrypt(cypherText, nonce, this.key, 'text'));

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function receive() {
        return _receive.apply(this, arguments);
      };
    }()
  }, {
    key: "createConnectUrl",
    value: function createConnectUrl(baseUrl) {
      var encodedKey = base64url.encode(this.key);
      return "".concat(baseUrl, "/telepath/connect#I=").concat(this.id, "&E=").concat(encodedKey);
    }
  }]);

  return SecureChannel;
}();

module.exports = SecureChannel;