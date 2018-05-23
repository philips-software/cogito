import {
  AttestationsRetriever,
  Identity,
  issue, accept, verify,
  serialize, deserialize
} from './index'

it('exports CogitoAttestations', () => {
  expect(AttestationsRetriever).toBeDefined()
})

it('exports Identity', () => {
  expect(Identity).toBeDefined()
})

it('exports the issue function', () => {
  expect(issue).toBeDefined()
})

it('exports the accept function', () => {
  expect(accept).toBeDefined()
})

it('exports the verify function', () => {
  expect(verify).toBeDefined()
})

it('exports the serialize function', () => {
  expect(serialize).toBeDefined()
})

it('exports the deserialize function', () => {
  expect(deserialize).toBeDefined()
})
