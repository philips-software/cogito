import { Sodium } from './Sodium'

describe('Sodium Helpers', () => {
  beforeAll(async () => {
    await Sodium.wait()
  })

  it('allows to check if sodium is ready', () => {
    expect(Sodium.ready).toBeTruthy()
  })

  it('provides the TAG_MESSAGE for stream encoding', () => {
    expect(Sodium.TAG_MESSAGE).toBe(0)
  })

  it('provides the TAG_FINAL for stream encoding', () => {
    expect(Sodium.TAG_FINAL).toBe(3)
  })

  describe('Sodium not intialized', () => {
    const error = new Error('Sodium not initialized! Did you forget to call `await Sodium.wait()`?')

    beforeEach(() => {
      Sodium.ready = false
    })

    it('throws an error if you access TAG_FINAL before initializing Sodium', () => {
      expect(() => { console.log(Sodium.TAG_FINAL) }).toThrow(error)
    })

    it('throws an error if you access TAG_MESSAGE before initializing Sodium', () => {
      expect(() => { console.log(Sodium.TAG_MESSAGE) }).toThrow(error)
    })
  })
})
