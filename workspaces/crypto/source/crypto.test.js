import { cryptoGenericHash } from './crypto'

describe('hasing', () => {
  it('can create hash of a short string', async () => {
    const hashValue = await cryptoGenericHash('zygfryd.hulajnoga@example.com')
    const hashString = Buffer.from(hashValue).toString('hex')
    expect(hashString).toEqual('60382e48863b1b21b1f98e324f26de175b3a7e1d071a62ba0da63db62bac9b6e')
  })

  it('is deterministic', async () => {
    const hashValue1 = await cryptoGenericHash('zygfryd.hulajnoga@example.com')
    const hashString1 = Buffer.from(hashValue1).toString('hex')
    const hashValue2 = await cryptoGenericHash('zygfryd.hulajnoga@example.com')
    const hashString2 = Buffer.from(hashValue2).toString('hex')
    expect(hashString1).toEqual(hashString2)
  })
})
