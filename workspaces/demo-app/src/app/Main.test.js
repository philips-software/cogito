import { Main } from './Main'
import { inRouter, EthereumForSimpleStorage } from 'test-helpers'
import { render, waitForElement } from 'test-helpers/render-props'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

jest.mock('@cogitojs/demo-app-contracts')
jest.mock('../services/documentation-loader')

jest.unmock('@cogitojs/cogito-react')
jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('Main', function () {
  beforeEach(async () => {
    console.log = jest.fn()
    const ethereum = await EthereumForSimpleStorage.setup()
    SimpleStorage.mockImplementation(() => {
      return ethereum.deployedJSON
    })
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('renders home page', async () => {
    const { container, getByText } = render(inRouter(Main, '/'))

    await waitForElement(() => getByText('Your Cogito account address is:'))
    expect(container).toMatchSnapshot()
  })

  it('renders contracts page', async () => {
    const { container, getByText } = render(inRouter(Main, '/contracts'))

    await waitForElement(() => getByText('Current value is:'))
    expect(container).toMatchSnapshot()
  })
})
