import React from 'react'
import { Header } from 'semantic-ui-react'

const Subtitle = ({ children }) => (
  <Header size='small' style={{ color: 'white' }}>
    {children}
  </Header>
)

export { Subtitle }
