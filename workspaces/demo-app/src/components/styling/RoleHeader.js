import React from 'react'
import glamorous from 'glamorous'
import { Spacer } from '@react-frontend-developer/react-layout-helpers'

const RoleHeader = ({ color, children }) => {
  const Wrapper = glamorous.div({
    margin: '10px',
    borderLeft: `5px solid ${color}`
  })

  return (
    <Wrapper>
      <Spacer padding='0 0 0 5px'>
        { children }
      </Spacer>
    </Wrapper>
  )
}

export { RoleHeader }
