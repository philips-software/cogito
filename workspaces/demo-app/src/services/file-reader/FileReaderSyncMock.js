const FileReaderSyncMock = function () {
  this.count = 0
  this.readAsArrayBuffer = blob => {
    if (this.count >= FileReaderSyncMock.abs.length) return undefined
    return FileReaderSyncMock.abs[this.count++]
  }
}

FileReaderSyncMock.abs = []
FileReaderSyncMock.prepare = abs => {
  FileReaderSyncMock.abs = abs
}

FileReaderSyncMock.reset = () => {
  FileReaderSyncMock.abs = []
}

export { FileReaderSyncMock }
