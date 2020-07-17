import React from 'react';
import AssignmentDashboard from './AssignmentDashboard';
import Feed from './feed';
import ClassView from './ClassView';
import SemesterCreator from './SemesterCreator'

function ProfilePage(props){
	return (
		<div className='page-container profile-page'>
			<div className='top'>
				<div className='row'>
					<div className='col-lg-8'>
						<img src="./generic_person.jpg" alt="Can't display image"/>
						<h1>Sarah Steel</h1>

						<img className='school' src="./generic_person.jpg" alt="Can't display image"/>
						<h2>Gannon University</h2>
					</div>
					<div className='col-lg-4'>
						<div style={{margin: '0 55px'}}>
							<button style={{marginRight: 30}} className='message'><i class="far fa-comment"></i> Message</button>
							<button className='follow'><i class="fas fa-plus"></i> Follow</button>
						</div>
					</div>
				</div>
				<hr/>
				<div className='classes row' style={{marginTop: 30}}>
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
			<div className='row'>
				<div className='col-lg-4'>
					<ClassView />
					<AssignmentDashboard profileMode={true} style={{marginTop: 20}} />
				</div>
				<div className='col-lg-8'>
					<div className='feed-container'>
						<Feed/>
					</div>
				</div>
			</div>
			<SemesterCreator/>
		</div>
	);
}


export default ProfilePage;