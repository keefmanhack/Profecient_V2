import React from 'react';
import {Link} from "react-router-dom";
import UserVerifier from '../../APIRequests/User Verifier/UserVerifier';
import { setTokens } from '../../Authentication/Tokens';
import MessageFlasher from '../Shared Resources/MessageFlasher';
import AbsractError from '../Shared Resources/Messages/Error Messages/AbsractError';
import LoginErr from '../Shared Resources/Messages/Error Messages/Concrete Errors/LoginErr';

import './login.css';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.uV = new UserVerifier();

		this.state={
			username:'',
			password: '',
			errMsg: ''
		}
	}
	async logUserIn(){
		const res = await this.uV.login(this.state.username, this.state.password);
		console.log(res);
		if(res.success){
			setTokens(res.tokens);
			this.props.history.push('/home');
			window.location.reload(true);
		}else{
			this.setState({errMsg: res.error});
		}
	}

	render(){
		return(
			<div className='background mont-font' id='login'>
				<Link className='blue-c' id='header-tag' to='/'>Profecient</Link>
				
				<h2 className='muted-c'>Welcome Back</h2>
				<h1 className='blue-c'>Login</h1>
				<MessageFlasher 
					condition={this.state.errMsg !== ''} 
					resetter={() => this.setState({errMsg: ''})}
				>
					<AbsractError errorMessage={this.state.errMsg}/>
				</MessageFlasher>
				<input
					onChange={(e) => this.setState({username: e.target.value})}
					style={{marginBottom: 10}} 
					className='mont-font' 
					type="text" 
					placeholder='Username'
				/>
				<input 
					onChange={(e) => this.setState({password: e.target.value})} 
					type="password" 
					placeholder='Password'
				/>
				<Link className='muted-c helper' to='/forgotPassword'>Forgot Password</Link>
				<Link className='muted-c helper' to="/">Don't have an account? Sign Up!</Link>
				<button onClick={() => this.logUserIn()} className='blue-bc black-c butt'>Login</button>
			</div>
		);
	}
}

export default Login;