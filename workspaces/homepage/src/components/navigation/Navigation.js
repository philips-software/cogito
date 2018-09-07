import React from 'react'
import glamorous from 'glamorous'

import { TopLevelNavigationItem } from './top-level-navigation-item'
import { NavigationItem } from './NavigationItem'

const List = glamorous.ul({
  listStyle: 'none',
  paddingTop: '0.5rem',
  paddingBottom: 0,
  margin: 0
})

export class Navigation extends React.PureComponent {
  state = {
    componentsDeltas: [],
    userDocumentationDeltas: []
  }

  aggregateDeltas = deltas => {
    if (deltas.length > 0) {
      return deltas.reduce((acc, val) => acc + val)
    }
    return 0
  }

  isActive = docs => {
    if (docs && docs.length > 0) {
      const filtered = docs.filter(d => d.node.frontmatter.path === this.props.location.pathname)
      return filtered.length > 0
    }
    return false
  }

  setDelta = (group, index, d) => {
    console.log('delta=', d)
    const deltas = this.state[`${group}Deltas`]
    deltas[index] = d
    this.setState({[`${group}Deltas`]: deltas})
  }

  render () {
    const { docs, location } = this.props
    console.log('docs=', docs)
    const userDocumentation = docs.filter(d => d.node.frontmatter.tag === 'user-documentation')
    const components = docs.filter(d => d.node.frontmatter.tag === 'component')
    console.log('location:', location)
    return (
      <div>
        <TopLevelNavigationItem
          title='User Documentation'
          active={this.isActive(userDocumentation)}
          delta={this.aggregateDeltas(this.state.userDocumentationDeltas)}>
          <div>
            <List>
              { userDocumentation.map((c, i) => (<NavigationItem key={i} {...c} onChange={delta => this.setDelta('userDocumentation', i, delta)} />)) }
            </List>
          </div>
        </TopLevelNavigationItem>
        <TopLevelNavigationItem
          title='Cogito Components'
          active={this.isActive(components)}
          delta={this.aggregateDeltas(this.state.componentsDeltas)}>
          <div>
            <List>
              { components.map((c, i) => (<NavigationItem key={i} {...c} onChange={delta => this.setDelta('components', i, delta)} />)) }
            </List>
          </div>
        </TopLevelNavigationItem>
      </div>
    )
  }
}
