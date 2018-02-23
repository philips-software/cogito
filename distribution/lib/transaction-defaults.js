'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonRpcClient = require('./json-rpc-client');
var TransactionNonces = require('./transaction-nonces');

var TransactionDefaults = function () {
  function TransactionDefaults(_ref) {
    var provider = _ref.provider;

    _classCallCheck(this, TransactionDefaults);

    this.client = new JsonRpcClient({ provider: provider });
    this.nonces = new TransactionNonces({ provider: provider });
  }

  _createClass(TransactionDefaults, [{
    key: 'apply',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(transaction) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = Object;
                _context.t1 = {};
                _context.t2 = transaction;
                _context.t3 = transaction.value || '0x0';
                _context.t4 = transaction.gasPrice;

                if (_context.t4) {
                  _context.next = 9;
                  break;
                }

                _context.next = 8;
                return this.getGasPrice();

              case 8:
                _context.t4 = _context.sent;

              case 9:
                _context.t5 = _context.t4;
                _context.t6 = transaction.nonce;

                if (_context.t6) {
                  _context.next = 15;
                  break;
                }

                _context.next = 14;
                return this.nonces.getNonce(transaction);

              case 14:
                _context.t6 = _context.sent;

              case 15:
                _context.t7 = _context.t6;
                _context.t8 = transaction.gas;

                if (_context.t8) {
                  _context.next = 21;
                  break;
                }

                _context.next = 20;
                return this.estimateGas(transaction);

              case 20:
                _context.t8 = _context.sent;

              case 21:
                _context.t9 = _context.t8;
                _context.t10 = transaction.chainId;

                if (_context.t10) {
                  _context.next = 27;
                  break;
                }

                _context.next = 26;
                return this.getChainId();

              case 26:
                _context.t10 = _context.sent;

              case 27:
                _context.t11 = _context.t10;
                _context.t12 = {
                  value: _context.t3,
                  gasPrice: _context.t5,
                  nonce: _context.t7,
                  gas: _context.t9,
                  chainId: _context.t11
                };
                return _context.abrupt('return', _context.t0.assign.call(_context.t0, _context.t1, _context.t2, _context.t12));

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function apply(_x) {
        return _ref2.apply(this, arguments);
      }

      return apply;
    }()
  }, {
    key: 'getGasPrice',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var request;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = { method: 'eth_gasPrice' };
                _context2.next = 3;
                return this.client.send(request);

              case 3:
                return _context2.abrupt('return', _context2.sent.result);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getGasPrice() {
        return _ref3.apply(this, arguments);
      }

      return getGasPrice;
    }()
  }, {
    key: 'estimateGas',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(transaction) {
        var request;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = {
                  method: 'eth_estimateGas',
                  params: [transaction]
                };
                _context3.next = 3;
                return this.client.send(request);

              case 3:
                return _context3.abrupt('return', _context3.sent.result);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function estimateGas(_x2) {
        return _ref4.apply(this, arguments);
      }

      return estimateGas;
    }()
  }, {
    key: 'getChainId',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var request;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = { method: 'net_version' };
                _context4.t0 = parseInt;
                _context4.next = 4;
                return this.client.send(request);

              case 4:
                _context4.t1 = _context4.sent.result;
                return _context4.abrupt('return', (0, _context4.t0)(_context4.t1));

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getChainId() {
        return _ref5.apply(this, arguments);
      }

      return getChainId;
    }()
  }]);

  return TransactionDefaults;
}();

module.exports = TransactionDefaults;