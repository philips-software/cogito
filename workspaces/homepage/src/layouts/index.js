import { React } from 'react'
import { DocumentationLayout } from './documentation'

const Layout = ({ location, children }) => {
  if (location.pathname === '' || location.pathname === '/') {
    return (
      <div>{children}</div>
    )
  } else {
    return (
      <DocumentationLayout location={location}>{children}</DocumentationLayout>
    )
  }
}

export default Layout
