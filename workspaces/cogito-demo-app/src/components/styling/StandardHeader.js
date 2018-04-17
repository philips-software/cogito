import React from 'react'
import { RoleHeader } from './RoleHeader'

const StandardHeader = ({ color, children }) => {
  const updatedChildren = React.Children.map(children, element =>
    React.cloneElement(element, { style: { margin: 0, padding: 0 } }))
  return (
    <RoleHeader color={color}>
      { updatedChildren }
    </RoleHeader>
  )
}

export { StandardHeader }
