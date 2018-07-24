const ExampleScript = () => {
  const ExampleWorker = function (file, callback) {
    // eslint-disable-next-line no-undef
    this.reader = new FileReaderSync()
    this.file = file
    this.callback = callback
  }

  ExampleWorker.prototype = {
    read: function () {
      const blob = this.file.slice(0, 10)
      this.callback && this.callback(new Uint8Array(this.reader.readAsArrayBuffer(blob)))
    }
  }

  const send = dataChunk => {
    // eslint-disable-next-line no-restricted-globals
    self.postMessage(dataChunk)
  }
  self.onmessage = e => {
    const exampleWorker = new ExampleWorker(e.data.file, send)
    exampleWorker.read()
  }
}

export { ExampleScript }
