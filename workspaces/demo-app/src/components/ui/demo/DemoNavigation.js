import React from 'react'
import { Centered } from '@react-frontend-developer/react-layout-helpers'

import { Dropdown } from 'semantic-ui-react'

const allDemos = [
  { text: 'Cogito Identity', url: '/' },
  { text: 'Executing Contracts', url: '/contracts' },
  { text: 'Cogito Attestations', url: '/attestations' },
  { text: 'Simple Encryption', url: '/simple-encryption' },
  { text: 'Stream Encryption', url: '/stream-encryption' }
]

class DemoNavigation extends React.PureComponent {
  state = { demos: [] }
  switchDemo = demoUrl => {
    const { history } = this.props
    history.push(demoUrl)
  }

  componentDidMount () {
    const { location: { pathname } } = this.props
    const demos = allDemos.filter(d => d.url !== pathname)
    this.setState({ demos })
  }

  render () {
    return (
      <Centered>
        <Dropdown upward icon='exchange' text='Switch demo...' pointing='top' floating labeled button className='icon'>
          <Dropdown.Menu>
            { this.state.demos.map(({text, url}) => (
              <Dropdown.Item key={text} text={text} onClick={() => this.switchDemo(url)} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Centered>
    )
  }
}

export { DemoNavigation }
