"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CogitoProvider = void 0;

var _accountsProvider = require("./accounts-provider");

var _transactionsProvider = require("./transactions-provider");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CogitoProvider =
/*#__PURE__*/
function () {
  function CogitoProvider(_ref) {
    var originalProvider = _ref.originalProvider,
        telepathChannel = _ref.telepathChannel;

    _classCallCheck(this, CogitoProvider);

    this.provider = originalProvider;
    this.accounts = new _accountsProvider.AccountsProvider({
      telepathChannel: telepathChannel
    });
    this.transactions = new _transactionsProvider.TransactionsProvider({
      originalProvider: originalProvider,
      telepathChannel: telepathChannel
    });
  }

  _createClass(CogitoProvider, [{
    key: "send",
    value: function send(payload, callback) {
      if (payload.method === 'eth_accounts') {
        this.accounts.send(payload, callback);
      } else if (payload.method === 'eth_sendTransaction') {
        this.transactions.send(payload, callback);
      } else {
        this.provider.send(payload, callback);
      }
    }
  }]);

  return CogitoProvider;
}();

exports.CogitoProvider = CogitoProvider;