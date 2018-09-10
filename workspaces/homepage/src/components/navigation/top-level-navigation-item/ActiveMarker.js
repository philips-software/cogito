import React from 'react'
import glamorous from 'glamorous'

const MarkerPositioner = glamorous.div({
  position: 'absolute',
  left: '10px'
})

const Circle = glamorous.div(({radius}) => ({
  height: radius,
  width: radius,
  backgroundColor: '#F486CA',
  borderRadius: '50%'
}))

const ActiveMarker = ({active}) => (
  <MarkerPositioner>
    <Circle radius='5px' />
  </MarkerPositioner>
)

export { ActiveMarker }
