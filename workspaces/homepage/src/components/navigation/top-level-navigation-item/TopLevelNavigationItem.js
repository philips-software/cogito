import React from 'react'
import glamorous from 'glamorous'

import { Collapsable } from '../Collapsable'
import { ArrowUp, ArrowDown } from './arrows'
import { ActiveMarker } from './ActiveMarker'

const Wrapper = glamorous.div({
  position: 'relative',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  backgroundColor: 'black',
  color: 'white',
  padding: '8px 13px 9px 22px',
  ':hover': {
    cursor: 'pointer'
  }
})

const Text = glamorous.div(({color = 'black'}) => ({
  fontFamily: 'Roboto Mono, monospace',
  fontWeight: '300',
  fontSize: '0.8rem',
  color: `${color}`
}))

const ArrowPositioner = glamorous.div({
  position: 'absolute',
  right: '13px'
})

class TopLevelNavigationItem extends React.Component {
  render () {
    return (
      <Collapsable delta={this.props.delta} trigger={(unfold, folded) => (
        <Wrapper onClick={() => unfold()}>
          {this.props.active && <ActiveMarker active={this.props.active} />}
          <Text color='white'>{this.props.title}</Text>
          <ArrowPositioner>
            { folded ? <ArrowDown /> : <ArrowUp /> }
          </ArrowPositioner>
        </Wrapper>
      )}>
        <div style={{backgroundColor: 'white', border: '1px solid #F7F7F7', width: '100%'}}>
          { this.props.children }
        </div>
      </Collapsable>
    )
  }
}

export { TopLevelNavigationItem }
