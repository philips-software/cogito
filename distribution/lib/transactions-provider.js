function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Defaults = require('./transaction-defaults');

var TransactionNonces = require('./transaction-nonces');

var TransactionsProvider =
/*#__PURE__*/
function () {
  function TransactionsProvider(_ref) {
    var originalProvider = _ref.originalProvider,
        telepathChannel = _ref.telepathChannel;

    _classCallCheck(this, TransactionsProvider);

    this.provider = originalProvider;
    this.channel = telepathChannel;
    this.defaults = new Defaults({
      provider: originalProvider
    });
    this.nonces = new TransactionNonces({
      provider: originalProvider
    });
  } // TODO: refactor


  _createClass(TransactionsProvider, [{
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(payload, callback) {
        var nonces, transaction, nonce, signedTransaction, sendRequest;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                nonces = this.nonces;
                _context.next = 4;
                return this.extractTransaction(payload);

              case 4:
                transaction = _context.sent;
                _context.t0 = transaction.nonce;

                if (_context.t0) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return nonces.getNonce(transaction);

              case 9:
                _context.t0 = _context.sent;

              case 10:
                nonce = _context.t0;
                transaction.nonce = nonce;
                _context.next = 14;
                return this.sign(transaction, payload.id);

              case 14:
                signedTransaction = _context.sent;
                sendRequest = {
                  jsonrpc: '2.0',
                  id: payload.id,
                  method: 'eth_sendRawTransaction',
                  params: [signedTransaction]
                };
                this.provider.send(sendRequest, function (error, result) {
                  if (!error) {
                    nonces.commitNonce(transaction);
                  }

                  callback(error, result);
                });
                _context.next = 22;
                break;

              case 19:
                _context.prev = 19;
                _context.t1 = _context["catch"](0);
                callback(_context.t1, null);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 19]]);
      }));

      return function send(_x, _x2) {
        return _send.apply(this, arguments);
      };
    }()
  }, {
    key: "extractTransaction",
    value: function () {
      var _extractTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(payload) {
        var transaction;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                transaction = payload.params[0];
                return _context2.abrupt("return", this.defaults.apply(transaction));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function extractTransaction(_x3) {
        return _extractTransaction.apply(this, arguments);
      };
    }()
  }, {
    key: "sign",
    value: function () {
      var _sign = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(transaction, requestId) {
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
                return _context3.abrupt("return", response.result);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function sign(_x4, _x5) {
        return _sign.apply(this, arguments);
      };
    }()
  }]);

  return TransactionsProvider;
}();

module.exports = TransactionsProvider;