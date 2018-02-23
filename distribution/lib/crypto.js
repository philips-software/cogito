'use strict';

var waitUntilReady = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ready) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return sodium.ready;

          case 3:
            ready = true;

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function waitUntilReady() {
    return _ref.apply(this, arguments);
  };
}();

var random = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return waitUntilReady();

          case 2:
            return _context2.abrupt('return', sodium.randombytes_buf.apply(sodium, _args2));

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function random() {
    return _ref2.apply(this, arguments);
  };
}();

var encrypt = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return waitUntilReady();

          case 2:
            return _context3.abrupt('return', sodium.crypto_secretbox_easy.apply(sodium, _args3));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function encrypt() {
    return _ref3.apply(this, arguments);
  };
}();

var decrypt = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return waitUntilReady();

          case 2:
            return _context4.abrupt('return', sodium.crypto_secretbox_open_easy.apply(sodium, _args4));

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function decrypt() {
    return _ref4.apply(this, arguments);
  };
}();

var keySize = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return waitUntilReady();

          case 2:
            return _context5.abrupt('return', sodium.crypto_secretbox_KEYBYTES);

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function keySize() {
    return _ref5.apply(this, arguments);
  };
}();

var nonceSize = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return waitUntilReady();

          case 2:
            return _context6.abrupt('return', sodium.crypto_secretbox_NONCEBYTES);

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function nonceSize() {
    return _ref6.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sodium = require('libsodium-wrappers');
var ready = false;

module.exports = { random: random, encrypt: encrypt, decrypt: decrypt, keySize: keySize, nonceSize: nonceSize };