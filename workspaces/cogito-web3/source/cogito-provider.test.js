import { CogitoProvider } from './cogito-provider'
import { AccountsProvider } from './accounts-provider'
import { TransactionsProvider } from './transactions-provider'

describe('provider', () => {
  let originalProvider
  let cogitoProvider

  beforeEach(() => {
    originalProvider = { send: jest.fn() }
    cogitoProvider = new CogitoProvider({ originalProvider })
  })

  it('forwards known requests to handlers', () => {
    const method = 'a_known_request_method'
    const handler = { send: jest.fn() }
    cogitoProvider.handlers[method] = handler
    cogitoProvider.send({ method }, () => {})
    expect(handler.send).toBeCalled()
  })

  it('forwards account requests to the accounts provider', () => {
    const accountHandler = cogitoProvider.handlers['eth_accounts']
    expect(accountHandler).toBeInstanceOf(AccountsProvider)
  })

  it('forwards transaction requests to the transaction provider', () => {
    const transactionsHandler = cogitoProvider.handlers['eth_sendTransaction']
    expect(transactionsHandler).toBeInstanceOf(TransactionsProvider)
  })

  it('forwards unknown requests to the original provider', () => {
    cogitoProvider.send({ method: 'unknown' })
    expect(originalProvider.send).toBeCalled()
  })
})
