import React from 'react';
import AssignmentDashboard from './AssignmentDashboard';
import Feed from './feed';
import ClassView from './ClassView';
import SemesterCreator from './Semester Creator/SemesterCreator';
import {FadeInOut_HandleState} from './CustomTransition';
import Header from './header';

class ProfilePage extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			showNewSem: false,
		}
	}

	showNewSem(val){
		this.setState({
			showNewSem: val,
		})
	}

	render(){
		return (
			<React.Fragment>
				<Header/>
				<div className='page-container profile-page' style={this.state.showNewSem ? {opacity: .7}: null}>
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
							<ClassView showNewSem={(val) => this.showNewSem(val)} />
							<AssignmentDashboard profileMode={true} style={{marginTop: 20}} />
						</div>
						<div className='col-lg-8'>
							<div className='feed-container'>
								<Feed/>
							</div>
						</div>
					</div>
					
				</div>
				<FadeInOut_HandleState condition={this.state.showNewSem}>
					<SemesterCreator showNewSem={(val) => this.showNewSem(val)}/>
				</FadeInOut_HandleState>
			</React.Fragment>
		);
	}
}


export default ProfilePage;