import '@react-frontend-developer/jsdom-worker'
import { FileStreamReaderWorkerScript } from './FileStreamReaderWorkerScript'
import { ReactWebWorker } from './ReactWebWorker'
import { TypedArrays } from '@react-frontend-developer/buffers'
import { FileReaderSyncMock } from './FileReaderSyncMock'
import { mockFileReaderSync } from './mockFileReaderSync'

describe('FileStreamReaderWorkerScript', () => {
  beforeAll(() => {
    global.FileReaderSync = FileReaderSyncMock
  })

  afterAll(() => {
    delete global.FileReaderSync
  })

  describe('creating a worker', () => {
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
