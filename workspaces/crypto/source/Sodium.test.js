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
})
