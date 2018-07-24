import '@react-frontend-developer/jsdom-worker'
import { FileStreamReader } from './FileStreamReader'

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

  // describe('reading chunks', () => {

  //   it('can read a chunk of data if the whole file is smaller than the size of the chunk', () => {

  //   })

  // })
})
