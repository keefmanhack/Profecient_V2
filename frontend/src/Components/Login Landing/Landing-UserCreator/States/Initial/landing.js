import React from 'react';
import {Link} from "react-router-dom";
import ReactPasswordStrength from 'react-password-strength';
import PhoneInput from 'react-phone-input-2'

import {FadeInOutHandleState} from '../../../../Shared Resources/Effects/CustomTransition';
import {phoneNumberTester, emailTester} from '../../../../../Authentication/RegexTesters';
import './landing.css';


class Landing extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			password: {password: '', isValid: false},
			repeatedPassword: '',
			errors: {
				firstName: false,
				lastName: false,
				email: false,
				phoneNumber: false,
				password: false,
				repeatedPassword: false,
			}
		}
	}
	async submitForm(){
		const isError = this.checkErrors();
		if(!isError){
			const data ={
				name: this.state.firstName + ' ' + this.state.lastName,
				email: this.state.email,
				phoneNumber: this.state.phoneNumber,
				password: this.state.password.password,
			}
			this.props.handleEvent(data);
		}
	}
	checkErrors(){
		let errors = this.state.errors;
		this.state.firstName === '' ? errors.firstName=true : errors.firstName=false;
		this.state.lastName === '' ? errors.lastName=true : errors.lastName=false;
		
		emailTester(this.state.email) ? errors.email=false : errors.email = true;
		phoneNumberTester(this.state.phoneNumber) ? errors.phoneNumber=false : errors.phoneNumber = true;

		!this.state.password.isValid ? errors.password=true : errors.password=false;
		this.state.repeatedPassword !== this.state.password.password ? errors.repeatedPassword=true : errors.repeatedPassword=false; 

		this.setState({errors: errors});
		for(let x in errors){
			if(errors[x]){
				return true;
			}
		}
		return false;
	}

	render(){
		return(
			<div className='background' id='landing'>
				<Link className='mont-font blue-c header-tag' to="/">Proficient</Link>
				<Link to='/home'>
					<button className='blue-bc mont-font login white-c'>Login</button>
				</Link>
				<div className='row'>
					<div className='col-lg-9'>
						<div className='tag-line'>
							<h2 className='mont-font black-c'>The <strong>socially-based</strong></h2>
							<h2 className='mont-font black-c'><strong>student</strong></h2>
							<h2 className='mont-font black-c'><strong>management</strong> tool</h2>
						</div>

						<ul className='white-c'>
							<li>
								<h5><i className="fas fa-tasks black-c"></i>    Manage your entire academic schedule</h5>
							</li>
							<li>
								<h5><i className="fas fa-comments black-c"></i>    Connect with your peers outside the classroom</h5>
							</li>
							<li>
								<h5><i className="fas fa-bell black-c"></i>    Automatically get assignment notifications from your peers</h5>
							</li>
						</ul>


						
					</div>
					<div className='col-lg-3'>
						<h3 className='sans-font black-c'>Sign Up</h3>
						<input 
							onChange={(e) => this.setState({firstName: e.target.value})} 
							className='sans-font' 
							type="text" 
							placeholder='John'
							style={this.state.errors.firstName ? {border: '1px solid red'} : null}
						/>
						<input 
							style={this.state.errors.lastName ? {border: '1px solid red', marginBottom: 50} : {marginBottom: 50}} 
							onChange={(e) => this.setState({lastName: e.target.value})} 
							className='sans-font'
							type="text" placeholder='Smith' 
						/>
						<input
							style={this.state.errors.email ? {border: '1px solid red'} : null}
							onChange={(e) => this.setState({email: e.target.value})} 
							className='sans-font' 
							type="email" 
							placeholder='johnsmith@proficient.com'
						/>
						<PhoneInput
							country={'us'}
							value={this.state.phoneNumber}
							onChange={phone => this.setState({phoneNumber: phone})}
							style={this.state.errors.phoneNumber ? {border: '1px solid red'} : null}
						/>
						<ReactPasswordStrength
							className="customClass"
							minLength={5}
							minScore={2}
							style={this.state.errors.password ? {border: '1px solid red', transition: '.3s'} : null}
							scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
							changeCallback={(e) => this.setState({password: e})}
							inputProps={{ name: "password_input", autoComplete: "off", className: "form-control sans-font", placeholder:'Password'}}
						/>
						<input 
							style={this.state.errors.repeatedPassword ? {border: '1px solid red'} : null}
							onChange={(e) => this.setState({repeatedPassword: e.target.value})} 
							className='sans-font' 
							type="password" 
							placeholder='Retype Password'
						/>
						<FadeInOutHandleState condition={this.state.password.password !== this.state.repeatedPassword}>
							<h5 className='red-c error'><i class="fas fa-times-circle"></i> The passwords don't match</h5>
						</FadeInOutHandleState>
						<button onClick={() => this.submitForm()} className='sign-up mont-font blue-bc white-c'>Sign Up</button>
					</div>
				</div>
				<Link id='footer-tag'>A Gregoire Design Production</Link>
			</div>
		);
	}
}

export default Landing;