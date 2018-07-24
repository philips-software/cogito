import { FileStreamReaderWorkerScript } from './FileStreamReaderWorkerScript'
import { ReactWebWorker } from './ReactWebWorker'

class FileStreamReader {
  file
  fileStreamReaderWorker = ReactWebWorker.createFromScript(
    FileStreamReaderWorkerScript
  )

  checkParams (params) {
    let errorMessage

    if (!params) {
      errorMessage = '{ file: File, callback: (chunk: Uint8Array) => Void }'
    } else {
      const { file, callback } = params
      if (!file && !callback) {
        errorMessage = '{ file: File, callback: (chunk: Uint8Array) => Void }'
      } else if (!file) {
        errorMessage = '{ file: File }'
      } else if (!callback) {
        errorMessage = '{ callback: (chunk: Uint8Array) => Void }'
      }
    }

    if (errorMessage) {
      throw new Error(
        `Missing or incomplete constructor arguments: ${errorMessage}.`
      )
    }
  }

  constructor (params) {
    this.checkParams(params)
    this.file = params.file
    this.fileStreamReaderWorker.onmessage = m => this.processDataChunk(m.data)
  }

  processDataChunk (datachunk) {
    console.log(datachunk)
  }

  startReading () {
    this.fileStreamReaderWorker.postMessage({
      file: this.file
    })
  }

  read (callback) {
    this.startReading()
  }
}

export { FileStreamReader }
