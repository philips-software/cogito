import React from 'react'
import { Link } from 'gatsby'
import GithubSlugger from 'github-slugger'
import glamorous from 'glamorous'

import { TopLevelNavigationItem } from './top-level-navigation-item/'

class MidLevelNavigationItem extends React.Component {
  state = {
    folded: true,
    style: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'max-height 0.2s ease-out'
    }
  }

  unfold () {
    if (this.state.folded) {
      this.props.onChange && this.props.onChange(this.div.scrollHeight)
      this.setState({
        folded: false,
        style: {
          ...this.state.style,
          maxHeight: `${this.div.scrollHeight}px`
        }
      })
    } else {
      this.props.onChange && this.props.onChange(0)
      this.setState({
        folded: true,
        style: {
          ...this.state.style,
          maxHeight: 0
        }
      })
    }
  }

  setDivRef = element => {
    this.div = element
  }

  render () {
    const { title, path } = this.props
    return (
      <div>
        <Wrapper2 onClick={() => this.unfold()}>
          <NavigationLink
            to={path}
            activeStyle={{
              color: 'black',
              fontFamily: 'Roboto Mono, monospace',
              fontWeight: '500',
              fontSize: '0.8rem',
              transition: 'color 0.2s ease-in-out 0s'
            }}
            isActive={isActiveGroup}
          >
            {title}
          </NavigationLink>
        </Wrapper2>
        <div style={this.state.style} ref={this.setDivRef}>
          <div style={{marginLeft: '1rem'}}>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}

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

const isActiveGroup = (match, location) => {
  return match && match.isExact
}

const Wrapper2 = glamorous.div({
  position: 'relative',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
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

const NavigationLink = glamorous(Link)(props => ({
  position: 'relative',
  left: '1rem',
  color: 'black',
  fontFamily: 'Roboto Mono, monospace',
  fontWeight: '300',
  fontSize: '0.8rem',
  textDecoration: 'none',
  ':hover': {
    color: 'black'
  },
  ':before': {
    backgroundColor: '#F486CA',
    content: ' ',
    position: 'absolute',
    width: '1px',
    height: '100%',
    top: 0,
    left: '-5px',
    visibility: 'hidden',
    transform: 'scaleY(0.3)',
    transition: 'all 0.3s ease-in-out 0s'
  },
  // '.active:before': {
  //   visibility: 'visible',
  //   transform: 'scaleY(1)',
  //   backgroundColor: '#F486CA'
  // },
  '.active': {
    color: 'black',
    fontFamily: 'Roboto Mono, monospace',
    fontWeight: '500',
    fontSize: '0.8rem',
    transition: 'color 0.2s ease-in-out 0s'
  },
  ':hover:before': {
    visibility: 'visible',
    transform: 'scaleY(1)'
  }
}))

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

const List = glamorous.ul({
  listStyle: 'none',
  // padding: '1rem',
  paddingTop: '0.5rem',
  paddingBottom: 0,
  margin: 0
})

const ListSubItem = glamorous.li({
  fontSize: '0.9rem'
})
