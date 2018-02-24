"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.assign");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.number.max-safe-integer");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var JsonRpcClient =
/*#__PURE__*/
function () {
  function JsonRpcClient(_ref) {
    var provider = _ref.provider;

    _classCallCheck(this, JsonRpcClient);

    this.provider = provider;
    this.requestId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2));
  }

  _createClass(JsonRpcClient, [{
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(request) {
        var provider;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                request = Object.assign({
                  jsonrpc: '2.0',
                  id: this.nextRequestId()
                }, request);
                provider = this.provider;
                return _context.abrupt("return", new Promise(function (resolve, reject) {
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
    key: "nextRequestId",
    value: function nextRequestId() {
      return "cogito.".concat(this.requestId++);
    }
  }]);

  return JsonRpcClient;
}();

module.exports = JsonRpcClient;