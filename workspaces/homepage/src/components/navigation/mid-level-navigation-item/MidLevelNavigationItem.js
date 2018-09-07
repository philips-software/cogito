import React from 'react'
import glamorous from 'glamorous'

import { NavigationLink } from '../NavigationLink'

const Wrapper = glamorous.div({
  position: 'relative',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
})

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

  isActiveGroup = (match, location) => {
    return match && match.isExact
  }

  render () {
    const { title, path } = this.props
    return (
      <div>
        <Wrapper onClick={() => this.unfold()}>
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
        <div style={this.state.style} ref={this.setDivRef}>
          <div style={{marginLeft: '1rem'}}>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}

export { MidLevelNavigationItem }
