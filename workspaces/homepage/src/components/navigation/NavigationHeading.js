import React from 'react'
import GithubSlugger from 'github-slugger'
import glamorous from 'glamorous'

import { NavigationLink } from './NavigationLink'

const ListSubItem = glamorous.li({
  fontSize: '0.9rem'
})

const isActiveSubItem = (match, location, anchor) => {
  return match && match.isExact && location.hash === `#${anchor}`
}

const NavigationHeading = ({ path, value, index }) => {
  const slugger = new GithubSlugger()
  const anchor = slugger.slug(value)
  return <ListSubItem key={index}>
    <NavigationLink
      to={`${path}#${anchor}`}
      activeClassName='active'
      // activeStyle={{
      //   color: 'black',
      //   fontFamily: 'Roboto Mono, monospace',
      //   fontWeight: '500',
      //   fontSize: '0.8rem',
      //   transition: 'color 0.2s ease-in-out 0s'
      // }}
      isActive={(match, location) => isActiveSubItem(match, location, anchor)}
    >
      { value }
    </NavigationLink>
  </ListSubItem>
}

export { NavigationHeading }
