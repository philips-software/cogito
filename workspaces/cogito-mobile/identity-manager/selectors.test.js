import { getIdentityName, isCreatingIdentity } from './selectors'

it('retrieves the identity name', () => {
  const state = { identity: { name: 'some name' } }
  expect(getIdentityName(state)).toEqual('some name')
})

it('knows whether an identity is being created', () => {
  const state = { identity: { creating: true } }
  expect(isCreatingIdentity(state)).toBe(true)
})
