import React from 'react';
import {authenticate} from './Authenticator';

class AuthenticateBeforeRender extends React.Component {
    state = {
      isAuthenticated: false,
    }
  
    componentDidMount() {
      authenticate().then(isAuthenticated => {
        this.setState({ isAuthenticated })
      })
    }
  
    render() {
      return this.state.isAuthenticated ? this.props.render() : null
    }
  }
export default AuthenticateBeforeRender;