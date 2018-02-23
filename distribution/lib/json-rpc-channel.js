'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonRpcChannel = function () {
  function JsonRpcChannel(_ref) {
    var channel = _ref.channel;

    _classCallCheck(this, JsonRpcChannel);

    this.channel = channel;
  }

  _createClass(JsonRpcChannel, [{
    key: 'send',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                checkRequest(request);
                this.channel.send(JSON.stringify(request));
                response = void 0;

              case 3:
                _context.t0 = parseResponse;
                _context.next = 6;
                return this.channel.receive();

              case 6:
                _context.t1 = _context.sent;
                response = (0, _context.t0)(_context.t1);

                if (response) {
                  _context.next = 10;
                  break;
                }

                throw new Error('timeout waiting for JSON-RPC response');

              case 10:
                if (response.id !== request.id) {
                  _context.next = 3;
                  break;
                }

              case 11:
                return _context.abrupt('return', response);

              case 12:
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
    key: 'createConnectUrl',
    value: function createConnectUrl(baseUrl) {
      return this.channel.createConnectUrl(baseUrl);
    }
  }, {
    key: 'id',
    get: function get() {
      return this.channel.id;
    }
  }, {
    key: 'key',
    get: function get() {
      return this.channel.key;
    }
  }]);

  return JsonRpcChannel;
}();

function checkRequest(request) {
  if (request.jsonrpc !== '2.0') {
    throw new Error('request is not a JSON-RPC 2.0 object');
  }
  if (request.id === undefined) {
    throw new Error('JSON-RPC request is missing an "id" property');
  }
  if (request.method === undefined) {
    throw new Error('JSON-RPC request is missing a "method" property');
  }
}

function parseResponse(response) {
  try {
    return JSON.parse(response);
  } catch (error) {
    return response;
  }
}

module.exports = JsonRpcChannel;