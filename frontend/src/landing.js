import React from 'react';
import {Link} from "react-router-dom";


class Landing extends React.Component{
	render(){
		return(
			<div className='background' id='landing'>
				<a className='mont-font blue-c' id='header-tag' href="#">Profecient</a>
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
								<h5><i class="fas fa-comments black-c"></i>    Message your peers and connect outside the classroom</h5>
							</li>
							<li>
								<h5><i class="fas fa-tasks black-c"></i>    Manage your entire academic schedule</h5>
							</li>
							<li>
								<h5><i class="fas fa-bell black-c"></i>    Automatically get assignment notifications from your peers</h5>
							</li>
						</ul>


						
					</div>
					<div className='col-lg-3'>
						<h3 className='sans-font black-c'>Sign Up</h3>
						<input className='sans-font' type="text" placeholder='First Name'/>
						<input className='sans-font' style={{marginBottom:50}} type="text" placeholder='Last Name'/>
						<input className='sans-font' type="email" placeholder='Email'/>
						<input className='sans-font' style={{marginBottom:50}} type="text" placeholder='Phone Number'/>
						<input className='sans-font' type="password" placeholder='Password'/>
						<input className='sans-font' type="password" placeholder='Retype Password'/>
						<button className='sign-up mont-font blue-bc white-c'>Sign Up</button>
					</div>
				</div>
				<a id='footer-tag'>A Gregoire Design Production</a>
			</div>
		);
	}
}

export default Landing;