"use strict";

async function delay(milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), milliseconds);
  });
}

module.exports = delay;