import React from 'react'
import { Header } from 'semantic-ui-react'

const Subtitle = ({ children }) => (
  <Header size='medium' style={{ color: 'white', marginTop: 0 }}>
    {children}
  </Header>
)

export { Subtitle }
