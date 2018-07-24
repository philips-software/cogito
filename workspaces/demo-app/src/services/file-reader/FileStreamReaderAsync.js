class FileStreamReaderAsync {
  reader
  start
  endExclusive
  file
  numberOfChunks
  callback
  constructor (file, callback) {
    this.reader = new FileReader()
    this.start = 0
    this.endExclusive = 4096
    this.file = file
    this.numberOfChunks = this.computeNumberOfChunks(file)
    this.callback = callback
  }

  async read () {
    for (let i = 0; i < this.numberOfChunks; i++) {
      if (this.callback) {
        const dataChunk = await this.readDataChunk(i)
        this.callback(dataChunk)
      }
      this.progressMarkers()
    }
  }

  computeNumberOfChunks (file) {
    const sizeOfLastDataChunk = file.size % 4096
    return Math.floor(file.size / 4096) + (sizeOfLastDataChunk === 0 ? 0 : 1)
  }

  progressMarkers () {
    this.start = this.start + 4096
    this.endExclusive = this.start + 4096
  }

  readDataChunk (index) {
    const blob =
      index === this.numberOfChunks - 1
        ? this.file.slice(this.start)
        : this.file.slice(this.start, this.endExclusive)
    return this.readAsArrayBuffer(blob)
  }

  async readAsArrayBuffer (blob) {
    let outerResolve
    const promise = new Promise(resolve => {
      outerResolve = resolve
    })
    this.reader.onloadend = evt => {
      if (evt.target.readyState === FileReader.DONE) {
        outerResolve(evt.target.result)
      }
    }
    this.reader.readAsArrayBuffer(blob)
    const data = await promise
    return data
  }
}

export { FileStreamReaderAsync }
