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
    userDocumentationDeltas: [],
    developerDocumentationDeltas: []
  }

  navigationGroups

  constructor (props) {
    super(props)

    this.navigationGroups = [
      this.createNavigationGroupForTag({
        title: 'Developer Documentation',
        tag: 'developer-documentation',
        deltaGroupName: 'developerDocumentation'
      }),
      this.createNavigationGroupForTag({
        title: 'Cogito Components',
        tag: 'component',
        deltaGroupName: 'components'
      })
    ]
  }

  createNavigationGroupForTag = ({title, tag, deltaGroupName}) => {
    return {
      title,
      docs: this.props.docs.filter(d => d.node.frontmatter.tag === tag),
      tag,
      deltaGroupName
    }
  }

  aggregateDeltas = deltas => {
    if (deltas.length > 0) {
      return deltas.reduce((acc, val) => acc + val)
    }
    return 0
  }

  isActive = docs => {
    if (docs && docs.length > 0) {
      const filtered = docs.filter(d => d.node.frontmatter.path === this.props.location.pathname.replace(/\/$/, ''))
      return filtered.length > 0
    }
    return false
  }

  setDelta = (group, index, d) => {
    const deltas = this.state[`${group}Deltas`]
    deltas[index] = d
    this.setState({[`${group}Deltas`]: deltas})
  }

  renderNavigationGroup = group => (
    <TopLevelNavigationItem
      key={group.tag}
      title={group.title}
      active={this.isActive(group.docs)}
      delta={this.aggregateDeltas(this.state[`${group.deltaGroupName}Deltas`])}>
      <div>
        <List>
          {
            group.docs.map((doc, i) => (
              <NavigationItem key={i} location={this.props.location} {...doc} onChange={delta => this.setDelta(group.deltaGroupName, i, delta)} />
            ))
          }
        </List>
      </div>
    </TopLevelNavigationItem>
  )

  render () {
    return (
      <div>
        { this.navigationGroups.map(g => this.renderNavigationGroup(g))}
      </div>
    )
  }
}
