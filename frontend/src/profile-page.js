import React from 'react';
import AssignmentDashboard from './AssignmentDashboard';
import Feed from './feed';
import ClassView from './ClassView';
import SemesterCreator from './Semester Creator/SemesterCreator';
import {FadeInOut_HandleState} from './CustomTransition';
import Header from './header';
import PostCreator from './PostCreator';
import Loader from './loader';
import axios from 'axios';

class ProfilePage extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			showNewSem: false,
			postData: null,
		}
	}

	componentDidMount(){
		this.getUserPosts();
	}

	getUserPosts(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/posts')
	    .then(res => {
			this.setState({
				postData: res.data,
			})
		})
	}

	showNewSem(val){
		this.setState({
			showNewSem: val,
		})
	}

	render(){
		const classList = this.props.currentUser.semesters[0].classes.map((data, index) =>
			<div className='col-lg-2'>
				<h5 key={data.id}>{data.name}</h5>
			</div>
		);

		return (
			<React.Fragment>
				<Header/>
				<div className='page-container profile-page' style={this.state.showNewSem ? {opacity: .7}: null}>
					<div className='top white-c'>
						<div className='row'>
							<div className='col-lg-8'>
								<img 
									src="https://proficient-assets.s3.us-east-2.amazonaws.com/landing.jpg" 
									alt="image not found" 
									onError={(e)=>{e.target.onerror = null; e.target.src="/generic_person.jpg"}}
								/>
								<h1>{this.props.currentUser.firstName} {this.props.currentUser.lastName}</h1>

								<img className='school' src={this.props.currentUser.school.logoUrl} alt="Can't display image"/>
								<h2>{this.props.currentUser.school.name}</h2>
							</div>
							<div className='col-lg-4'>
								<div style={{margin: '0 55px'}}>
									<button style={{marginRight: 30}} className='white-bc black-c'><i class="far fa-comment"></i> Message</button>
									<button className='blue-bc black-c'><i class="fas fa-plus"></i> Follow</button>
								</div>
							</div>
						</div>
						<div className='classes row' style={{marginTop: 30}}>
							{classList}
						</div>
					</div>
					<div className='row'>
						<div className='col-lg-4 left'>
							<ClassView semesters={this.props.currentUser.semesters} showNewSem={(val) => this.showNewSem(val)} />
						</div>
						<div className='col-lg-8'>
							<PostCreator currentUser={this.props.currentUser}/>
							<div className='feed-container'>
								<Feed 
									feedData={this.state.postData} 
									currentUser={this.props.currentUser}
								/>
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