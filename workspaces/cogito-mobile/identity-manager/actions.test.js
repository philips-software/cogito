import { add, addIsPending, addIsFinished, store } from './actions'
import { Wallet } from 'ethers'

describe('when adding a new identity', () => {
  const name = 'some name'
  const wallet = { some: 'wallet' }
  const encryptedWallet = 'Encrypted Wallet'
  let dispatch

  beforeEach(() => {
    jest
      .spyOn(Wallet, 'createRandom')
      .mockResolvedValue(wallet)
    wallet.encrypt = jest.fn().mockResolvedValue(encryptedWallet)
    dispatch = jest.fn()
  })

  it('signals that it is adding an identity', () => {
    add(name)(dispatch)
    expect(dispatch).toBeCalledWith(addIsPending())
  })

  it('encrypts the wallet with a default password', async () => {
    await add(name)(dispatch)
    expect(wallet.encrypt).toBeCalledWith('password')
  })

  it('stores a new cryptographic identity', async () => {
    await add(name)(dispatch)
    expect(dispatch).toBeCalledWith(store({ name, wallet: encryptedWallet }))
  })

  it('signals that it finished adding an identity', async () => {
    await add(name)(dispatch)
    expect(dispatch).toBeCalledWith(addIsFinished())
  })
})
