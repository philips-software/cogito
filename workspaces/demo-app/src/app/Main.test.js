import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { Main } from './Main'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { inRouter } from 'test-helpers/router'

const state = {
  userData: {
    connectionEstablished: false,
    balance: 0
  },
  appEvents: {},
  encryption: {
    plainText: '',
    cipherText: ''
  }
}

WithStore.mockStore(state)

it('renders without crashing', async () => {
  const div = document.createElement('div')
  await ReactDOM.render(inRouter(Main, '/'), div)
})

it('renders correctly', async () => {
  const app = await renderer
    .create(inRouter(Main, '/'))
  expect(app.toJSON()).toMatchSnapshot()
})
