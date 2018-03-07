function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var JsonRpcClient = require('./json-rpc-client'); // Calculates transaction nonces. The main problem that this code attempts to
// solve is that the ethereum node does not take pending transactions into
// account when returning the transaction count, leading to duplicated
// transaction nonces when sending a new transaction while another is pending
// (see https://github.com/ethereum/go-ethereum/issues/2880).
// Our solution is to keep a local transaction count, and synchronize that with
// the node transaction count when appropriate
// (loosely based on https://github.com/livepeer/go-livepeer/pull/252).


var TransactionNonces =
/*#__PURE__*/
function () {
  function TransactionNonces(_ref) {
    var provider = _ref.provider;

    _classCallCheck(this, TransactionNonces);

    this.client = new JsonRpcClient({
      provider: provider
    });
    this.nonces = {};
  }

  _createClass(TransactionNonces, [{
    key: "getNonce",
    value: function () {
      var _getNonce = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(transaction) {
        var localNonce, remoteNonce, nonce;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                localNonce = this.getLocalNonce(transaction);
                _context.next = 3;
                return this.getRemoteNonce(transaction);

              case 3:
                remoteNonce = _context.sent;
                nonce = Math.max(remoteNonce, localNonce);
                return _context.abrupt("return", "0x".concat(nonce.toString(16)));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function getNonce(_x) {
        return _getNonce.apply(this, arguments);
      };
    }()
  }, {
    key: "commitNonce",
    value: function commitNonce(transaction) {
      var nonce = parseInt(transaction.nonce.substr(2), 16);
      this.nonces[transaction.from] = nonce + 1;
    }
  }, {
    key: "getLocalNonce",
    value: function getLocalNonce(transaction) {
      var nonce = this.nonces[transaction.from] || 0;
      return nonce;
    }
  }, {
    key: "getRemoteNonce",
    value: function () {
      var _getRemoteNonce = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(transaction) {
        var request, nonceHex;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = {
                  method: 'eth_getTransactionCount',
                  params: [transaction.from, 'pending']
                };
                _context2.next = 3;
                return this.client.send(request);

              case 3:
                nonceHex = _context2.sent.result;
                return _context2.abrupt("return", parseInt(nonceHex.substr(2), 16));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function getRemoteNonce(_x2) {
        return _getRemoteNonce.apply(this, arguments);
      };
    }()
  }]);

  return TransactionNonces;
}();

module.exports = TransactionNonces;