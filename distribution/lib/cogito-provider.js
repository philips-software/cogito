'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountsProvider = require('./accounts-provider');
var TransactionsProvider = require('./transactions-provider');

var CogitoProvider = function () {
  function CogitoProvider(_ref) {
    var originalProvider = _ref.originalProvider,
        telepathChannel = _ref.telepathChannel;

    _classCallCheck(this, CogitoProvider);

    this.provider = originalProvider;
    this.accounts = new AccountsProvider({ telepathChannel: telepathChannel });
    this.transactions = new TransactionsProvider({
      originalProvider: originalProvider, telepathChannel: telepathChannel
    });
  }

  _createClass(CogitoProvider, [{
    key: 'send',
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

module.exports = CogitoProvider;