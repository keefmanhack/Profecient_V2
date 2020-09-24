import React from 'react';
import {Link, BrowserRouter as Router} from "react-router-dom";

import './login.css';

class Login extends React.Component{
	render(){
		return(
			<div className='background' id='login'>
				<a className='mont-font blue-c' id='header-tag' href="#">Profecient</a>

				<h2 className='mont-font muted-c'>Welcome Back</h2>
				<h1 className='mont-font blue-c'>Login</h1>
				<input style={{marginBottom: 10}} className='mont-font' type="text" placeholder='Username or email'/>
				<input className='mont-font' type="password" placeholder='Password'/>
				<a className='mont-font muted-c helper' href="#">Forgot Password?</a>
				<a className='mont-font muted-c helper' href="#">Don't have an account? Sign Up!</a>
				<Link className='mont-font blue-bc black-c butt' to='Home'>Login</Link>
			</div>
		);
	}
}

export default Login;