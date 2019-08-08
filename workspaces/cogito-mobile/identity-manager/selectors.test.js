import {
  getIdentityName,
  isCreatingIdentity,
  wasIdentityCreated
} from './selectors'

it('retrieves the identity name', () => {
  const state = { identity: { name: 'some name' } }
  expect(getIdentityName(state)).toEqual('some name')
})

it('knows whether an identity is being created', () => {
  const state = { identity: { creating: true } }
  expect(isCreatingIdentity(state)).toBe(true)
})

it('knows when an identity has been created', () => {
  const wallet = { some: 'wallet' }
  const state = { identity: { wallet } }
  expect(wasIdentityCreated(state)).toBe(true)
})
