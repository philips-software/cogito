import '@react-frontend-developer/jsdom-worker'
import { FileStreamReaderWorkerScript } from './FileStreamReaderWorkerScript'
import { ExampleScript } from './ExampleScript'
import { ReactWebWorker } from './ReactWebWorker'
import { TypedArrays } from '@react-frontend-developer/buffers'

const readAsArrayBuffer = async blob => {
  let outerResolve
  const fr = new FileReader()
  const promise = new Promise(resolve => {
    outerResolve = resolve
  })
  fr.onloadend = function (evt) {
    if (evt.target.readyState === FileReader.DONE) {
      outerResolve(evt.target.result)
    }
  }
  fr.readAsArrayBuffer(blob)
  const data = await promise
  return data
}

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

class FileStreamReaderAsync {
  reader
  start
  endExclusive
  file
  numberOfChunks
  callback
  constructor (file, callback) {
    // eslint-disable-next-line no-undef
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

const mockFileReaderSync = async file => {
  const abs = []
  const fileStreamReaderAsync = new FileStreamReaderAsync(file, dataChunk => {
    abs.push(dataChunk)
  })

  await fileStreamReaderAsync.read()

  FileReaderSyncMock.prepare(abs)
}

describe('FileStreamReaderWorkerScript', () => {
  beforeAll(() => {
    global.FileReaderSync = FileReaderSyncMock
  })

  afterAll(() => {
    delete global.FileReaderSync
  })

  describe('creating a worker', () => {
    beforeEach(() => {
      FileReaderSyncMock.reset()
    })

    it('works', done => {
      let code = `onmessage = e => postMessage(e.data*2)`
      const blob = new Blob([code], {type: 'application/javascript'})
      let worker = new Worker(URL.createObjectURL(blob))
      worker.onmessage = data => {
        expect(data).toEqual({ data: 10 })
        done()
      }
      worker.postMessage(5) // 10
    })

    it('works 2', async done => {
      const testFile = new File(
        [TypedArrays.string2ab('ala ma kota')],
        'test-file.png',
        { type: 'image/png' }
      )
      const blob = testFile.slice(0, 10)
      const ab = await readAsArrayBuffer(blob)
      FileReaderSyncMock.prepare([ab])
      let worker = ReactWebWorker.createFromScript(
        ExampleScript
      )
      worker.onmessage = d => {
        expect(d.data).toEqual(new Uint8Array(ab))
        done()
      }
      worker.postMessage({file: testFile})
    })

    it('creates worker', () => {
      let streamReaderWorker
      expect(() => {
        streamReaderWorker = ReactWebWorker.createFromScript(
          FileStreamReaderWorkerScript
        )
      }).not.toThrow()
      expect(streamReaderWorker).toBeDefined()
    })
  })

  describe('reading contents of the file', () => {
    const testContent = 'test content'
    const testOnePageContent = Uint8Array.from({ length: 4096 }, (v, k) => k)
    const testOnePagePlusContent = Uint8Array.from(
      { length: 4097 },
      (v, k) => k
    )
    let testFile
    let streamReaderWorker
    let promises
    let dataChunks

    const expectDataChunks = N => {
      for (let i = 0; i < N; i++) {
        promises.push(
          // eslint-disable-next-line no-loop-func
          new Promise(resolve => {
            dataChunks.push(resolve)
          })
        )
      }
    }

    const readDataChunk = async () => {
      const dataChunk = await promises.shift()
      return {
        dataChunk,
        remaining: promises.length
      }
    }

    beforeEach(() => {
      FileReaderSyncMock.reset()
      promises = []
      dataChunks = []
      streamReaderWorker = ReactWebWorker.createFromScript(
        FileStreamReaderWorkerScript
      )
      streamReaderWorker.onmessage = m => {
        const resolve = dataChunks.shift()
        if (!resolve) {
          throw new Error('Received more chunks than expected!')
        }
        resolve(m.data)
      }
    })

    it('can read a file that is smaller than one page (4096B)', async () => {
      testFile = new File(
        [TypedArrays.string2ab(testContent)],
        'test-file.png',
        { type: 'image/png' }
      )

      expectDataChunks(1)
      await mockFileReaderSync(testFile)

      streamReaderWorker.postMessage({
        file: testFile
      })

      const { dataChunk, remaining } = await readDataChunk()

      expect(TypedArrays.uint8Array2string(dataChunk)).toBe(testContent)
      expect(remaining).toBe(0)
    })

    it('reads exactly one 4096B page when file size is 4096B', async () => {
      testFile = new File([testOnePageContent.buffer], 'test-file.png', {
        type: 'image/png'
      })

      expectDataChunks(1)
      await mockFileReaderSync(testFile)

      streamReaderWorker.postMessage({
        file: testFile
      })

      const { dataChunk, remaining } = await readDataChunk()

      expect(dataChunk).toEqual(testOnePageContent)
      expect(remaining).toBe(0)
    })

    it('reads two pages when file size 4097B', async () => {
      testFile = new File([testOnePagePlusContent.buffer], 'test-file.png', {
        type: 'image/png'
      })

      expectDataChunks(2)
      await mockFileReaderSync(testFile)

      streamReaderWorker.postMessage({
        file: testFile
      })

      const { dataChunk: chunk1, remaining: remaining1 } = await readDataChunk()
      expect(chunk1).toEqual(testOnePageContent)
      expect(remaining1).toBe(1)

      const { dataChunk: chunk2, remaining: remaining2 } = await readDataChunk()
      expect(chunk2).toEqual(Uint8Array.from({ length: 1 }, (v, k) => k))
      expect(remaining2).toBe(0)
    })
  })
})
