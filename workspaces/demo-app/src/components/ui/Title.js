import React from 'react'
import { Header } from 'semantic-ui-react'

const Title = ({ children }) => (
  <Header size='huge' style={{ color: 'white' }}>
    {children}
  </Header>
)

export { Title }
