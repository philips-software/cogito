import React from 'react'
import glamorous from 'glamorous'
import { Spacer } from '../layout/Spacer'

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
