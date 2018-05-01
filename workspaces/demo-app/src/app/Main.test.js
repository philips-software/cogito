import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { Main } from './Main'
import { inRouter } from 'test-helpers/router'

it('renders without crashing', async () => {
  const div = document.createElement('div')
  await ReactDOM.render(inRouter(Main, '/'), div)
})

it('renders correctly', async () => {
  const app = await renderer
    .create(inRouter(Main, '/'))
  expect(app.toJSON()).toMatchSnapshot()
})
