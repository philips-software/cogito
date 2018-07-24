import '@react-frontend-developer/jsdom-worker'
import { FileStreamReader } from './FileStreamReader'
import { FileReaderSyncMock } from './FileReaderSyncMock'
import { mockFileReaderSync } from './mockFileReaderSync'

describe('FileStreamReader', () => {
  describe('creating', () => {
    it('expects a File object and a callback as the arguments when initialized', () => {
      const testFile = new File(['part1', 'part2'], 'test-file.png', {
        type: 'image/png'
      })

      const callback = jest.fn()

      let streamReader
      expect(() => {
        streamReader = new FileStreamReader({
          file: testFile,
          callback
        })
      }).not.toThrow()
      expect(streamReader).toBeDefined()
    })

    it('throws if input file has not been provided in the constructor', () => {
      const error = new Error(
        `Missing or incomplete constructor arguments: { file: File }.`
      )
      let streamReader
      expect(() => {
        streamReader = new FileStreamReader({ callback: jest.fn() })
      }).toThrow(error)
      expect(streamReader).not.toBeDefined()
    })

    it('throws if callback has not been provided in the constructor', () => {
      const testFile = new File(['part1', 'part2'], 'test-file.png', {
        type: 'image/png'
      })
      const error = new Error(
        `Missing or incomplete constructor arguments: { callback: (chunk: Uint8Array) => Void }.`
      )
      let streamReader
      expect(() => {
        streamReader = new FileStreamReader({ file: testFile })
      }).toThrow(error)
      expect(streamReader).not.toBeDefined()
    })

    it('throws if no arguments have been provided in the constructor', () => {
      const error = new Error(
        `Missing or incomplete constructor arguments: { file: File, callback: (chunk: Uint8Array) => Void }.`
      )
      let streamReader
      expect(() => {
        streamReader = new FileStreamReader()
      }).toThrow(error)
      expect(streamReader).not.toBeDefined()
    })
  })

  describe('reading chunks', () => {
    const testOnePageContent = Uint8Array.from({ length: 4096 }, (v, k) => k)
    const testOnePagePlusContent = Uint8Array.from(
      { length: 4097 },
      (v, k) => k
    )

    beforeAll(() => {
      global.FileReaderSync = FileReaderSyncMock
    })

    afterAll(() => {
      delete global.FileReaderSync
    })

    it('uses underlying web worker to read the data chunks', async () => {
      const testFile = new File([testOnePagePlusContent.buffer], 'test-file.png', {
        type: 'image/png'
      })

      await mockFileReaderSync(testFile)

      let receivedDataChunks = []
      let callback

      const promise = new Promise(resolve => {
        callback = dataChunk => {
          receivedDataChunks.push(dataChunk)
          if (dataChunk.length < 4096) {
            resolve()
          }
        }
      })

      const streamReader = new FileStreamReader({
        file: testFile,
        callback
      })

      streamReader.read()

      await promise

      expect(receivedDataChunks.length).toBe(2)
      expect(receivedDataChunks[0]).toEqual(testOnePageContent)
      expect(receivedDataChunks[1]).toEqual(Uint8Array.from({ length: 1 }, (v, k) => k))
    })
  })
})
