import React from 'react'
import glamorous from 'glamorous'

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
  state = {
    folded: true,
    delta: 0,
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

  componentDidUpdate (prevProps) {
    if (this.props.delta !== prevProps.delta) {
      console.log('componentDidUpdate', this.props.delta, this.div.scrollHeight)
      if (!this.state.folded) {
        this.setState({
          delta: this.props.delta,
          style: {
            ...this.state.style,
            maxHeight: `${this.div.scrollHeight + this.props.delta}px`
          }
        })
      }
    }
  }

  unfold () {
    if (this.state.folded) {
      this.setState({
        folded: false,
        style: {
          ...this.state.style,
          maxHeight: `${this.div.scrollHeight}px`
        }
      })
    } else {
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
    return (
      <div>
        <Wrapper onClick={() => this.unfold()}>
          {this.props.active && <ActiveMarker active={this.props.active} />}
          <Text color='white'>{this.props.title}</Text>
          <ArrowPositioner>
            { this.state.folded ? <ArrowDown /> : <ArrowUp /> }
          </ArrowPositioner>
        </Wrapper>
        <div style={this.state.style} ref={this.setDivRef}>
          <div style={{backgroundColor: 'white', border: '1px solid #F7F7F7', width: '100%'}}>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}

export { TopLevelNavigationItem }
