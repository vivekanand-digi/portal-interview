// Packages
import React from 'react'
import { Route } from 'react-router-dom'

// View
import UnAuthorized from '../components/Authorization/403'

//Utils
import { getFromLocal } from '../utils/storage/index'

function PrivateRoute({ component: Component, exact, ...rest }) {
  return (
    <Route
      exact={exact}
      {...rest}
      render={(props) =>
        (getFromLocal('user_loged_in') === 'admin' && window.location.href.includes('admin')) ||
        window.location.href.includes('viewcandidate') ||
        (getFromLocal('user_loged_in') === 'interviewer' &&
          (window.location.href.includes('interviewerClient') ||
            window.location.href.includes('interviewer') ||
            window.location.href.includes('viewcandidate'))) ? (
          <Component {...props} />
        ) : (
          <UnAuthorized />
        )
      }
    />
  )
}
export default PrivateRoute
