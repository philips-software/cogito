function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var sodium = require('libsodium-wrappers');

var ready = false;

function waitUntilReady() {
  return _waitUntilReady.apply(this, arguments);
}

function _waitUntilReady() {
  _waitUntilReady = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
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
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _waitUntilReady.apply(this, arguments);
}

function random() {
  return _random.apply(this, arguments);
}

function _random() {
  _random = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return waitUntilReady();

          case 2:
            return _context2.abrupt("return", sodium.randombytes_buf.apply(sodium, _args2));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _random.apply(this, arguments);
}

function encrypt() {
  return _encrypt.apply(this, arguments);
}

function _encrypt() {
  _encrypt = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return waitUntilReady();

          case 2:
            return _context3.abrupt("return", sodium.crypto_secretbox_easy.apply(sodium, _args3));

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt() {
  return _decrypt.apply(this, arguments);
}

function _decrypt() {
  _decrypt = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return waitUntilReady();

          case 2:
            return _context4.abrupt("return", sodium.crypto_secretbox_open_easy.apply(sodium, _args4));

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _decrypt.apply(this, arguments);
}

function keySize() {
  return _keySize.apply(this, arguments);
}

function _keySize() {
  _keySize = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return waitUntilReady();

          case 2:
            return _context5.abrupt("return", sodium.crypto_secretbox_KEYBYTES);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _keySize.apply(this, arguments);
}

function nonceSize() {
  return _nonceSize.apply(this, arguments);
}

function _nonceSize() {
  _nonceSize = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return waitUntilReady();

          case 2:
            return _context6.abrupt("return", sodium.crypto_secretbox_NONCEBYTES);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return _nonceSize.apply(this, arguments);
}

module.exports = {
  random: random,
  encrypt: encrypt,
  decrypt: decrypt,
  keySize: keySize,
  nonceSize: nonceSize
};