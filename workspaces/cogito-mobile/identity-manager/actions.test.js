import { add, store } from './actions'

it('creates a new cryptographic identity', async () => {
  const name = 'some name'
  const dispatch = jest.fn()
  await add(name)(dispatch)
  expect(dispatch).toBeCalledWith(store(name))
})
