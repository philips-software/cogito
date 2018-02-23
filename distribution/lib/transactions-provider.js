'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Defaults = require('./transaction-defaults');

var TransactionsProvider = function () {
  function TransactionsProvider(_ref) {
    var originalProvider = _ref.originalProvider,
        telepathChannel = _ref.telepathChannel;

    _classCallCheck(this, TransactionsProvider);

    this.provider = originalProvider;
    this.channel = telepathChannel;
    this.defaults = new Defaults({ provider: originalProvider });
  }

  _createClass(TransactionsProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payload, callback) {
        var transaction, signedTransaction, sendRequest;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.extractTransaction(payload);

              case 3:
                transaction = _context.sent;
                _context.next = 6;
                return this.sign(transaction, payload.id);

              case 6:
                signedTransaction = _context.sent;
                sendRequest = {
                  jsonrpc: '2.0',
                  id: payload.id,
                  method: 'eth_sendRawTransaction',
                  params: [signedTransaction]
                };

                this.provider.send(sendRequest, callback);
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](0);

                callback(_context.t0, null);

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 11]]);
      }));

      function send(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'extractTransaction',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(payload) {
        var transaction;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                transaction = payload.params[0];
                return _context2.abrupt('return', this.defaults.apply(transaction));

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function extractTransaction(_x3) {
        return _ref3.apply(this, arguments);
      }

      return extractTransaction;
    }()
  }, {
    key: 'sign',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(transaction, requestId) {
        var signRequest, response;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                signRequest = {
                  jsonrpc: '2.0',
                  id: requestId,
                  method: 'sign',
                  params: [transaction]
                };
                _context3.next = 3;
                return this.channel.send(signRequest);

              case 3:
                response = _context3.sent;

                if (!response.error) {
                  _context3.next = 6;
                  break;
                }

                throw new Error(response.error.message);

              case 6:
                return _context3.abrupt('return', response.result);

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sign(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return sign;
    }()
  }]);

  return TransactionsProvider;
}();

module.exports = TransactionsProvider;