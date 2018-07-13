import React from 'react'
import { Link } from 'gatsby'
import GithubSlugger from 'github-slugger'
import glamorous from 'glamorous'

export const Navigation = ({ docs }) => (
  <List>
    { docs.map(NavigationItem) }
  </List>
)

const isActiveGroup = (match, location) => {
  return match && match.isExact
}

const NavigationItem = ({ node: { headings, frontmatter: { title, path } } }) => (
  <li key={path}>
    <NavigationLink
      to={path}
      activeStyle={{
        color: 'white',
        transition: 'color 0.2s ease-in-out 0s'
      }}
      isActive={isActiveGroup}
    >
      {title}
    </NavigationLink>
    <List>
      { headings.map((heading, index) => NavigationHeading({ ...heading, path, index })) }
    </List>
  </li>
)

const NavigationLink = glamorous(Link)({
  position: 'relative',
  color: 'black',
  textDecoration: 'none',
  ':hover': {
    color: 'black'
  },
  ':before': {
    content: ' ',
    position: 'absolute',
    width: '1px',
    height: '100%',
    top: 0,
    left: '-5px',
    backgroundColor: '#000',
    visibility: 'hidden',
    transform: 'scaleY(0.3)',
    transition: 'all 0.3s ease-in-out 0s'
  },
  '.active:before': {
    backgroundColor: 'white'
  },
  ':hover:before': {
    visibility: 'visible',
    transform: 'scaleY(1)'
  }
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
      activeStyle={{
        color: 'white',
        transition: 'color 0.2s ease-in-out 0s'
      }}
      isActive={(match, location) => isActiveSubItem(match, location, anchor)}
    >
      { value }
    </NavigationLink>
  </ListSubItem>
}

const List = glamorous.ul({
  listStyle: 'none',
  padding: '1rem',
  margin: 0
})

const ListSubItem = glamorous.li({
  fontSize: '0.9rem'
})
