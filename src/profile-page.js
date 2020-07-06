import React from 'react';
import AssignmentDashboard from './AssignmentDashboard';
import Feed from './feed'

function ProfilePage(props){
	return (
		<div className='page-container profile-page'>
			<div className='top row'>
				<div className='col-lg-8'>
					<img src="./generic_person.jpg" alt="Can't display image"/>
					<h1>Sarah Steel</h1>

					<img className='school' src="./generic_person.jpg" alt="Can't display image"/>
					<h2>Gannon University</h2>

					<div className='classes row'>
						<div className='col-lg-2'>
							<h5>English</h5>
						</div>
						<div className='col-lg-2'>
							<h5>English</h5>
						</div>
						<div className='col-lg-2'>
							<h5>English</h5>
						</div>
						<div className='col-lg-2'>
							<h5>English</h5>
						</div>
						<div className='col-lg-2'>
							<h5>English</h5>
						</div>
						<div className='col-lg-2'>
							<h5>English</h5>
						</div>
					</div>
				</div>
				<div className='col-lg-4'>
					<button className='message'>Message</button>
					<button className='follow'>Follow</button>
				</div>
			</div>
			<div className='row'>
				<div className='col-lg-4'>
					<AssignmentDashboard />
				</div>
				<div className='col-lg-8'>
					<Feed/>
				</div>
			</div>
		</div>
	);
}


export default ProfilePage;