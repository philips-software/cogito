import React from 'react'
import glamorous from 'glamorous'

import { MidLevelNavigationItem } from './mid-level-navigation-item'
import { NavigationHeading } from './NavigationHeading'

const List = glamorous.ul({
  listStyle: 'none',
  paddingTop: '0.5rem',
  paddingBottom: 0,
  margin: 0
})

class NavigationItem extends React.Component {
  renderNavigationHeading = (heading, index, path) => (
    <NavigationHeading key={index} {...heading} path={path} index={index} />
  )

  render () {
    const { node: { headings, frontmatter: { title, path } }, onChange, location } = this.props

    return (
      <li key={path}>
        <MidLevelNavigationItem location={location} path={path} title={title} onChange={onChange}>
          { headings.length > 0 && <List>
            { headings.map((heading, index) => this.renderNavigationHeading(heading, index, path)) }
          </List> }
        </MidLevelNavigationItem>
      </li>
    )
  }
}

export { NavigationItem }
