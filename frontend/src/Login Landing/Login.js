import React from 'react';
import {Link} from "react-router-dom";

import './login.css';

class Login extends React.Component{
	render(){
		return(
			<div className='background' id='login'>
				<Link className='mont-font blue-c' id='header-tag' to='/'>Profecient</Link>
				

				<h2 className='mont-font muted-c'>Welcome Back</h2>
				<h1 className='mont-font blue-c'>Login</h1>
				<input style={{marginBottom: 10}} className='mont-font' type="text" placeholder='Username or email'/>
				<input className='mont-font' type="password" placeholder='Password'/>
				<Link className='mont-font muted-c helper' to='/'>Forgot Password</Link>
				<Link className='mont-font muted-c helper' to="/">Don't have an account? Sign Up!</Link>
				<Link className='mont-font blue-bc black-c butt' to='Home'>Login</Link>
			</div>
		);
	}
}

export default Login;