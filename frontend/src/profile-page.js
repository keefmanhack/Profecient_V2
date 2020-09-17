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
			currSemesterIndex: -1,
			semesters: [],
			editSemMode: false,
		}
	}

	componentDidMount(){
		this.getUserPosts();
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


	getSemesters(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/semesters')
	    .then(res => {
			this.setState({
				semesters: res.data,
				currSemesterIndex: res.data.length-1,
			})
		})

	}

	showNewSem(val){
		let editMode = this.state.editSemMode
		if(!val){
			this.getSemesters();
			this.props.updateCurrentUser();
			editMode = false;
		}

		this.setState({
			showNewSem: val,
			editSemMode: editMode,
		})
	}

	editCurrentSem(){
		this.setState({
			editSemMode: true,
			showNewSem: true,
		})
	}

	deleteCurrentSem(){
		const endPoint = `http://localhost:8080/users/` + this.props.currentUser._id + '/semesters/' + this.state.semesters[this.state.currSemesterIndex]._id;
		axios.delete(endPoint)
	    .then(res => {
			this.getSemesters();
			this.props.updateCurrentUser();
		})
		.catch((err) =>{
			console.log(err);
		})
	}

	changeCurrentSem(i){
		this.setState({
			currSemesterIndex: i,
		})
	}

	render(){
		let currSemExists = this.state.currSemesterIndex >-1;
		const classList = currSemExists ? this.state.semesters[this.state.currSemesterIndex].classes.map((data, index) =>
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
								currSemesterIndex={this.state.currSemesterIndex} 
								semesters={this.state.semesters} 
								showNewSem={() => this.showNewSem(true)}
								editCurrSem={() => this.editCurrentSem()}
								deleteCurrSem={() => this.deleteCurrentSem()}
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
					<SemesterCreator
						currentUser={this.props.currentUser} 
						hideNewSemForm={() => this.showNewSem(false)}
						updateData={this.state.editSemMode ? this.state.semesters[this.state.currSemesterIndex] : null}
					/>
				</FadeInOut_HandleState>
			</React.Fragment>
		);
	}
}


export default ProfilePage;