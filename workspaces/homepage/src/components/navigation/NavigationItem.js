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

const NavigationItem = ({ node: { headings, frontmatter: { title, path } }, onChange }) => (
  <li key={path}>
    <MidLevelNavigationItem path={path} title={title} onChange={onChange}>
      { headings.length > 0 && <List>
        { headings.map((heading, index) => NavigationHeading({ ...heading, path, index })) }
      </List> }
    </MidLevelNavigationItem>
  </li>
)

export { NavigationItem }
