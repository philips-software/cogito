import { add, addIsPending, addIsFinished, store } from './actions'
import { Wallet } from 'ethers'

describe('when adding a new identity', () => {
  const name = 'some name'
  const wallet = { some: 'wallet' }

  beforeEach(() => {
    jest
      .spyOn(Wallet, 'createRandom')
      .mockResolvedValue(wallet)
  })

  it('signals that it is adding an identity', () => {
    const dispatch = jest.fn()
    add(name)(dispatch)
    expect(dispatch).toBeCalledWith(addIsPending())
  })

  it('stores a new cryptographic identity', async () => {
    const dispatch = jest.fn()
    await add(name)(dispatch)
    expect(dispatch).toBeCalledWith(store({ name, wallet }))
  })

  it('signals that it finished adding an identity', async () => {
    const dispatch = jest.fn()
    await add(name)(dispatch)
    expect(dispatch).toBeCalledWith(addIsFinished())
  })
})
