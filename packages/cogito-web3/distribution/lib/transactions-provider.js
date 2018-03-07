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
  }

  _createClass(TransactionsProvider, [{
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(payload, callback) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.t0 = callback;
                _context.next = 4;
                return this.sendWithDefaults(payload);

              case 4:
                _context.t1 = _context.sent;
                (0, _context.t0)(null, _context.t1);
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t2 = _context["catch"](0);
                callback(_context.t2, null);

              case 11:
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
  }, {
    key: "sendWithDefaults",
    value: function () {
      var _sendWithDefaults = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(payload) {
        var transaction, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                transaction = payload.params[0];
                _context2.next = 3;
                return this.setDefaults(transaction);

              case 3:
                transaction = _context2.sent;
                _context2.next = 6;
                return this.setNonce(transaction);

              case 6:
                transaction = _context2.sent;
                _context2.next = 9;
                return this.sendTransaction(transaction, payload.id);

              case 9:
                result = _context2.sent;

                if (!result.error) {
                  this.nonces.commitNonce(transaction);
                }

                return _context2.abrupt("return", result);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function sendWithDefaults(_x3) {
        return _sendWithDefaults.apply(this, arguments);
      };
    }()
  }, {
    key: "setDefaults",
    value: function () {
      var _setDefaults = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(transaction) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.defaults.apply(transaction));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function setDefaults(_x4) {
        return _setDefaults.apply(this, arguments);
      };
    }()
  }, {
    key: "setNonce",
    value: function () {
      var _setNonce = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(transaction) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.t0 = Object;
                _context4.t1 = {};
                _context4.t2 = transaction;
                _context4.t3 = transaction.nonce;

                if (_context4.t3) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 7;
                return this.nonces.getNonce(transaction);

              case 7:
                _context4.t3 = _context4.sent;

              case 8:
                _context4.t4 = _context4.t3;
                _context4.t5 = {
                  nonce: _context4.t4
                };
                return _context4.abrupt("return", _context4.t0.assign.call(_context4.t0, _context4.t1, _context4.t2, _context4.t5));

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function setNonce(_x5) {
        return _setNonce.apply(this, arguments);
      };
    }()
  }, {
    key: "sendTransaction",
    value: function () {
      var _sendTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(transaction, requestId) {
        var signedTransaction;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.sign(transaction, requestId);

              case 2:
                signedTransaction = _context5.sent;
                return _context5.abrupt("return", this.sendRaw(signedTransaction, requestId));

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function sendTransaction(_x6, _x7) {
        return _sendTransaction.apply(this, arguments);
      };
    }()
  }, {
    key: "sign",
    value: function () {
      var _sign = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(transaction, requestId) {
        var signRequest, response;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                signRequest = {
                  jsonrpc: '2.0',
                  id: requestId,
                  method: 'sign',
                  params: [transaction]
                };
                _context6.next = 3;
                return this.channel.send(signRequest);

              case 3:
                response = _context6.sent;

                if (response) {
                  _context6.next = 6;
                  break;
                }

                throw new Error('timeout while waiting for signature');

              case 6:
                if (!response.error) {
                  _context6.next = 8;
                  break;
                }

                throw new Error(response.error.message);

              case 8:
                return _context6.abrupt("return", response.result);

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function sign(_x8, _x9) {
        return _sign.apply(this, arguments);
      };
    }()
  }, {
    key: "sendRaw",
    value: function () {
      var _sendRaw = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(signedTransaction, requestId) {
        var provider, request;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                provider = this.provider;
                request = {
                  jsonrpc: '2.0',
                  id: requestId,
                  method: 'eth_sendRawTransaction',
                  params: [signedTransaction]
                };
                return _context7.abrupt("return", new Promise(function (resolve, reject) {
                  provider.send(request, function (error, result) {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result);
                    }
                  });
                }));

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function sendRaw(_x10, _x11) {
        return _sendRaw.apply(this, arguments);
      };
    }()
  }]);

  return TransactionsProvider;
}();

module.exports = TransactionsProvider;