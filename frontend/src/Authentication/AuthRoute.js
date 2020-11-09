import React from 'react';
import {Route} from "react-router-dom";
import AuthenticateBeforeRender from './AuthenticateBeforeRender';
import {isAuthenticated} from './Authenticator';

const AuthRoute = ({
  component: Component,
  exact,
  path,
}) => (
  <Route
    exact={exact}
    path={path}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <AuthenticateBeforeRender render={() => <Component {...props} />} />
      )
    }
  />
)

export default AuthRoute;