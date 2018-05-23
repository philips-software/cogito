import { AttestationsRetriever, issue, accept } from './index'

it('exports CogitoAttestations', () => {
  expect(AttestationsRetriever).toBeDefined()
})

it('exports the issue function', () => {
  expect(issue).toBeDefined()
})

it('exports the accept function', () => {
  expect(accept).toBeDefined()
})
