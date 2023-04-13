// Packages
import React from 'react'
import { Route } from 'react-router-dom'

function PublicRoute({ component: Component, exact, ...rest }) {
  return <Route exact={exact} {...rest} render={(props) => <Component {...props} />} />
}

export default PublicRoute
