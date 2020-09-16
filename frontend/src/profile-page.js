import React from 'react';

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
			currSemester: {},
			semesters: [],
		}
	}

	componentDidMount(){
		this.getUserPosts();
		this.getClassData();
		this.getSemesters();
	}

	getUserPosts(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/posts')
	    .then(res => {
			this.setState({
				postData: res.data,
			})
		})
	}

	getClassData(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/semesters/current')
	    .then(res => {
			this.setState({
				currSemester: res.data
			})
		})
	}

	getSemesters(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/semesters')
	    .then(res => {
	    	let currentSem = this.setCurrentSemester(res.data);
	    	
			this.setState({
				semesters: res.data,
				currSemester: currentSem,
			})
		})
	}

	setCurrentSemester(semesters){
		let returnVal;
		if(semesters){
			semesters.forEach(function(sem){
				if(sem._id === this.props.currentUser.currentSemesterID){
	    			returnVal = sem;
	    		}
			}.bind(this))
		}

		return returnVal;
	}

	showNewSem(val){
		this.setState({
			showNewSem: val,
		})

		if(!val){
			this.getSemesters();
			this.getClassData();
		}
	}

	editCurrentSem(){
		alert('clicked');
	}

	changeCurrentSem(i){

		if(!this.state.semesters[i]._id.equals(this.props.currentUser.currentSemesterID)){
			const endPoint = `http://localhost:8080/users/` + this.props.currentUser._id + '/semesters/current';

			axios.post(endPoint, {semID: this.state.semesters[i]._id})
			.then((res) => {
				this.props.updateCurrentUser();

				let currentSem = this.setCurrentSemester(this.state.semesters);
				this.setState({
					currSemester: currentSem,
				})
			})
		}
	}

	render(){
		let currSemExists = this.state.currSemester && this.state.currSemester.classes;
		const classList = currSemExists ? this.state.currSemester.classes.map((data, index) =>
			<div className='col-lg-2'>
				<h5 key={data.id}>{data.name}</h5>
			</div>
		): null;

		return (
			<React.Fragment>
				<Header currentUser={this.props.currentUser}/>
				<div className='page-container profile-page' style={this.state.showNewSem ? {opacity: .5}: null}>
					<div className='top white-c'>
						<div className='row'>
							<div className='col-lg-8'>
								<img 
									src="https://proficient-assets.s3.us-east-2.amazonaws.com/landing.jpg" 
									alt="image not found" 
									onError={(e)=>{e.target.onerror = null; e.target.src="/generic_person.jpg"}}
								/>
								<h1>{this.props.currentUser.name}</h1>

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
							<ClassView 
								currSemester={this.state.currSemester} 
								semesters={this.state.semesters} 
								showNewSem={() => this.showNewSem(true)}
								editCurrentSem={() => this.editCurrentSem()}
								currSemExists={currSemExists}
								changeCurrentSem={(i) => this.changeCurrentSem(i)}
							/>
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
					<SemesterCreator currentUser={this.props.currentUser} hideNewSemForm={() => this.showNewSem(false)}/>
				</FadeInOut_HandleState>
			</React.Fragment>
		);
	}
}


export default ProfilePage;