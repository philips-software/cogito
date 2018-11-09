/* istanbul ignore next */
const FileStreamReaderWorkerScript = () => {
  const FileStreamReaderWorker = function (file, callback) {
    // eslint-disable-next-line no-undef
    this.reader = new FileReaderSync()
    this.start = 0
    this.endExclusive = 4096
    this.file = file
    this.numberOfChunks = this.computeNumberOfChunks(file)
    this.callback = callback
  }

  FileStreamReaderWorker.prototype = {
    read: function () {
      for (let i = 0; i < this.numberOfChunks; i++) {
        this.callback && this.callback(this.readDataChunk(i))
        this.progressMarkers()
      }
    },

    computeNumberOfChunks: function (file) {
      const sizeOfLastDataChunk = file.size % 4096
      return Math.floor(file.size / 4096) + (sizeOfLastDataChunk === 0 ? 0 : 1)
    },

    progressMarkers: function () {
      this.start = this.start + 4096
      this.endExclusive = this.start + 4096
    },

    readDataChunk: function (index) {
      const blob =
        index === this.numberOfChunks - 1
          ? this.file.slice(this.start)
          : this.file.slice(this.start, this.endExclusive)
      return new Uint8Array(this.reader.readAsArrayBuffer(blob))
    }
  }

  const send = dataChunk => {
    // eslint-disable-next-line no-restricted-globals
    self.postMessage(dataChunk)
  }

  // eslint-disable-next-line no-restricted-globals
  self.onmessage = e => {
    const fileStreamReaderWorker = new FileStreamReaderWorker(e.data.file, send)
    fileStreamReaderWorker.read()
  }
}

export { FileStreamReaderWorkerScript }
