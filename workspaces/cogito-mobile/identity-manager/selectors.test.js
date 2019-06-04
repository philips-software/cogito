import { getIdentityName } from './selectors'

it('retrieves the identity name', () => {
  const state = { identity: { name: 'some name' } }
  expect(getIdentityName(state)).toEqual('some name')
})
