"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var JsonRpcChannel =
/*#__PURE__*/
function () {
  function JsonRpcChannel(_ref) {
    var channel = _ref.channel;

    _classCallCheck(this, JsonRpcChannel);

    this.channel = channel;
  }

  _createClass(JsonRpcChannel, [{
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(request) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                checkRequest(request);
                this.channel.send(JSON.stringify(request));

              case 2:
                _context.t0 = parseResponse;
                _context.next = 5;
                return this.channel.receive();

              case 5:
                _context.t1 = _context.sent;
                response = (0, _context.t0)(_context.t1);

                if (response) {
                  _context.next = 9;
                  break;
                }

                throw new Error('timeout waiting for JSON-RPC response');

              case 9:
                if (response.id !== request.id) {
                  _context.next = 2;
                  break;
                }

              case 10:
                return _context.abrupt("return", response);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function send(_x) {
        return _send.apply(this, arguments);
      };
    }()
  }, {
    key: "createConnectUrl",
    value: function createConnectUrl(baseUrl) {
      return this.channel.createConnectUrl(baseUrl);
    }
  }, {
    key: "id",
    get: function get() {
      return this.channel.id;
    }
  }, {
    key: "key",
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