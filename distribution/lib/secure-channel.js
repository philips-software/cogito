'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base64url = require('base64url');

var _require = require('./crypto'),
    random = _require.random,
    encrypt = _require.encrypt,
    decrypt = _require.decrypt,
    nonceSize = _require.nonceSize;

var Poller = require('./poller');

var SecureChannel = function () {
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
        return queuing.receive(id + '.blue');
      },
      interval: 1000,
      retries: 600
    });
  }

  _createClass(SecureChannel, [{
    key: 'send',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {
        var queueId, nonce, cypherText, nonceAndCypherText;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                queueId = this.id + '.red';
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
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'receive',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
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

                return _context2.abrupt('return', null);

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
                return _context2.abrupt('return', decrypt(cypherText, nonce, this.key, 'text'));

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function receive() {
        return _ref3.apply(this, arguments);
      }

      return receive;
    }()
  }, {
    key: 'createConnectUrl',
    value: function createConnectUrl(baseUrl) {
      var encodedKey = base64url.encode(this.key);
      return baseUrl + '/telepath/connect#I=' + this.id + '&E=' + encodedKey;
    }
  }]);

  return SecureChannel;
}();

module.exports = SecureChannel;