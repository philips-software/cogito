import React from 'react'
import glamorous from 'glamorous'

import { Collapsable } from '../Collapsable'
import { NavigationLink } from '../NavigationLink'

const Wrapper = glamorous.div({
  position: 'relative',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
})

class MidLevelNavigationItem extends React.Component {
  isActiveGroup = (match, location) => {
    return match && match.isExact
  }

  render () {
    const { title, path } = this.props

    return (
      <Collapsable onChange={this.props.onChange} trigger={(unfold, folded) => (
        <Wrapper onClick={() => unfold()}>
          <NavigationLink
            to={path}
            activeStyle={{
              color: 'black',
              fontFamily: 'Roboto Mono, monospace',
              fontWeight: '500',
              fontSize: '0.8rem',
              transition: 'color 0.2s ease-in-out 0s'
            }}
            isActive={this.isActiveGroup}
          >
            {title}
          </NavigationLink>
        </Wrapper>
      )}>
        <div style={{marginLeft: '1rem', width: 'calc(100% - 1rem)'}}>
          { this.props.children }
        </div>
      </Collapsable>
    )
  }
}

export { MidLevelNavigationItem }
