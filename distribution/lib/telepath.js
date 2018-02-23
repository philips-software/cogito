'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var createRandomId = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
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
            return _context2.abrupt('return', idString);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createRandomId() {
    return _ref3.apply(this, arguments);
  };
}();

var createRandomKey = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = random;
            _context3.next = 3;
            return keySize();

          case 3:
            _context3.t1 = _context3.sent;
            return _context3.abrupt('return', (0, _context3.t0)(_context3.t1));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function createRandomKey() {
    return _ref4.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base64url = require('base64url');

var _require = require('./crypto'),
    random = _require.random,
    keySize = _require.keySize;

var SecureChannel = require('./secure-channel');
var JsonRpcChannel = require('./json-rpc-channel');
var QueuingService = require('./queuing-service');

var Telepath = function () {
  function Telepath(queuingServiceUrl) {
    _classCallCheck(this, Telepath);

    this.queuing = new QueuingService(queuingServiceUrl);
  }

  _createClass(Telepath, [{
    key: 'createChannel',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            id = _ref2.id,
            key = _ref2.key;

        var channelId, channelKey, channel;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = id;

                if (_context.t0) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return createRandomId();

              case 4:
                _context.t0 = _context.sent;

              case 5:
                channelId = _context.t0;
                _context.t1 = key;

                if (_context.t1) {
                  _context.next = 11;
                  break;
                }

                _context.next = 10;
                return createRandomKey();

              case 10:
                _context.t1 = _context.sent;

              case 11:
                channelKey = _context.t1;
                channel = new SecureChannel({
                  id: channelId,
                  key: channelKey,
                  queuing: this.queuing
                });
                return _context.abrupt('return', new JsonRpcChannel({ channel: channel }));

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createChannel() {
        return _ref.apply(this, arguments);
      }

      return createChannel;
    }()
  }]);

  return Telepath;
}();

module.exports = Telepath;