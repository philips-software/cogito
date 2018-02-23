'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base64url = require('base64url');
var fetch = require('cross-fetch');
var Request = fetch.Request;

var QueuingService = function () {
  function QueuingService(baseUrl) {
    _classCallCheck(this, QueuingService);

    this.baseUrl = baseUrl;
  }

  _createClass(QueuingService, [{
    key: 'send',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(queueId, message) {
        var url, body, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.baseUrl + '/' + queueId;
                body = base64url.encode(Buffer.from(message));
                _context.next = 4;
                return fetch(new Request(url, { method: 'POST', body: body }));

              case 4:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 7;
                  break;
                }

                throw new Error('sending failed (' + response.status + ')');

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'receive',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(queueId) {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetch(this.baseUrl + '/' + queueId);

              case 2:
                response = _context2.sent;

                if (response.ok) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('receiving failed (' + response.status + ')');

              case 5:
                if (!(response.status === 204)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return', null);

              case 7:
                _context2.t0 = base64url;
                _context2.next = 10;
                return response.text();

              case 10:
                _context2.t1 = _context2.sent;
                return _context2.abrupt('return', _context2.t0.toBuffer.call(_context2.t0, _context2.t1));

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function receive(_x3) {
        return _ref2.apply(this, arguments);
      }

      return receive;
    }()
  }]);

  return QueuingService;
}();

module.exports = QueuingService;