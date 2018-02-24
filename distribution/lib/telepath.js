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
    keySize = _require.keySize;

var SecureChannel = require('./secure-channel');

var JsonRpcChannel = require('./json-rpc-channel');

var QueuingService = require('./queuing-service');

var Telepath =
/*#__PURE__*/
function () {
  function Telepath(queuingServiceUrl) {
    _classCallCheck(this, Telepath);

    this.queuing = new QueuingService(queuingServiceUrl);
  }

  _createClass(Telepath, [{
    key: "createChannel",
    value: function () {
      var _createChannel = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _ref,
            id,
            key,
            channelId,
            channelKey,
            channel,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, id = _ref.id, key = _ref.key;
                _context.t0 = id;

                if (_context.t0) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return createRandomId();

              case 5:
                _context.t0 = _context.sent;

              case 6:
                channelId = _context.t0;
                _context.t1 = key;

                if (_context.t1) {
                  _context.next = 12;
                  break;
                }

                _context.next = 11;
                return createRandomKey();

              case 11:
                _context.t1 = _context.sent;

              case 12:
                channelKey = _context.t1;
                channel = new SecureChannel({
                  id: channelId,
                  key: channelKey,
                  queuing: this.queuing
                });
                return _context.abrupt("return", new JsonRpcChannel({
                  channel: channel
                }));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createChannel() {
        return _createChannel.apply(this, arguments);
      };
    }()
  }]);

  return Telepath;
}();

function createRandomId() {
  return _createRandomId.apply(this, arguments);
}

function _createRandomId() {
  _createRandomId = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var idSize, idBytes, idString;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            idSize = 18;
            _context2.next = 3;
            return random(idSize);

          case 3:
            idBytes = _context2.sent;
            idString = base64url.encode(idBytes);
            return _context2.abrupt("return", idString);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _createRandomId.apply(this, arguments);
}

function createRandomKey() {
  return _createRandomKey.apply(this, arguments);
}

function _createRandomKey() {
  _createRandomKey = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = random;
            _context3.next = 3;
            return keySize();

          case 3:
            _context3.t1 = _context3.sent;
            return _context3.abrupt("return", (0, _context3.t0)(_context3.t1));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _createRandomKey.apply(this, arguments);
}

module.exports = Telepath;