import { add, store } from './actions'
import { Wallet } from 'ethers'

describe('when adding a new identity', () => {
  const wallet = { some: 'wallet' }

  beforeEach(() => {
    jest
      .spyOn(Wallet, 'createRandom')
      .mockResolvedValue(wallet)
  })

  it('stores a new cryptographic identity', async () => {
    const name = 'some name'
    const dispatch = jest.fn()

    await add(name)(dispatch)

    expect(dispatch).toBeCalledWith(store({ name, wallet }))
  })
})
