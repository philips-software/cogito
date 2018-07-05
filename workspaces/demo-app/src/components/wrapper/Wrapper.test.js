import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { Wrapper } from './Wrapper'

let exampleWrapper

beforeEach(() => {
  exampleWrapper = <Wrapper><p>Some Text</p></Wrapper>
})

it('renders without crashing', async () => {
  const div = document.createElement('div')
  await ReactDOM.render(exampleWrapper, div)
})

it('renders correctly', () => {
  const component = renderer
    .create(exampleWrapper)
  expect(component.toJSON()).toMatchSnapshot()
})
