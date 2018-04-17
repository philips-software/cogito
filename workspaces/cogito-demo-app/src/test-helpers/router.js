import React from 'react'
import { MemoryRouter as Router, Route } from 'react-router-dom'

export const inRouter = (Component, path) => {
  return (
    <Router initialEntries={[ path ]} initialIndex={0}>
      <Route exact path={path} component={Component} />
    </Router>
  )
}

export const renderInRouter = (componentRenderFunction, path) => {
  return (
    <Router initialEntries={[ path ]} initialIndex={0}>
      <Route exact path={path} render={componentRenderFunction} />
    </Router>
  )
}
