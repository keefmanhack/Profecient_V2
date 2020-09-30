import React from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

import Feed from '../Shared Resources/feed';
import ClassView from './Class View/ClassView';
import SemesterCreator from './Semester Creator/SemesterCreator';
import {FadeInOutHandleState} from '../Shared Resources/Effects/CustomTransition';
import Header from '../Shared Resources/header';
import PostCreator from '../Shared Resources/PostCreator';
// import Loader from '../Shared Resources/Effects/loader';
import LinkSelector from '../Shared Resources/Link Selector/LinkSelector';

import './profile-page.css';

class ProfilePage extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			showNewSem: false,
			postData: null,
			currSemesterIndex: -1,
			semesters: [],
			editSemMode: false,
			profile: null,
			showNewLinkForm: false,
			selectedClassIndex: null,
		}
	}

	componentDidMount(){
		this.getProfileData();
	}

	getProfileData(){
		this.getUserPosts();
		this.getSemesters();
		this.getRequestedUser();
	}

	getRequestedUser(){
		axios.get(`http://localhost:8080/users/` + this.props.foundUser)
	    .then(res => {
	    	this.setState({
	    		profile: res.data,
	    	})
		})
	}

	getUserPosts(){
		axios.get(`http://localhost:8080/users/` + this.props.foundUser + '/posts')
	    .then(res => {
			this.setState({
				postData: res.data,
			})
		})
	}


	getSemesters(){
		axios.get(`http://localhost:8080/users/` + this.props.foundUser + '/semesters')
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

	findClassIndex(classID){
		let i =0;
		const classes = this.state.semesters[this.state.currSemesterIndex].classes;
		for(;i<classes.length; i++){
			if(classID === classes[i]._id){
				break;
			}
		}
		return i;
	}

	addLink(classID){
		this.setState({selectedClassIndex: this.findClassIndex(classID)});
		this.showLinkSelector(true);
	}

	removeLink(classID){
		const endPoint =  `http://localhost:8080/users/` + this.props.currentUser._id + '/class/connection/delete';

		const data={
			otherUser: this.state.profile._id,
			otherUserClass: this.state.semesters[this.state.currSemesterIndex].classes[this.findClassIndex(classID)],
		}

		axios.post(endPoint, data)
	    .then(res => {
			this.getSemesters();

		})
	}

	showLinkSelector(val){
		this.setState({showNewLinkForm: val})
	}

	render(){
		let currSemExists = this.state.currSemesterIndex >-1;
		const classList = currSemExists ? this.state.semesters[this.state.currSemesterIndex].classes.map((data, index) =>
			<div key={index} className='col-lg-2'>
				<h5 key={data.id}>{data.name}</h5>
			</div>
		): null;

		return (
			<React.Fragment>
				<Header currentUser={this.props.currentUser}/>
				{this.state.profile !== null ? 
					<div className='page-container profile-page' style={this.state.showNewSem ? {opacity: .5}: null}>
						<div className='top white-c'>
							<div className='row'>
								<div className='col-lg-8'>
									<img 
										src={"https://proficient-assets.s3.us-east-2.amazonaws.com/" + this.state.profile.profilePictureURL}
										alt="Not found" 
										onError={(e)=>{e.target.onerror = null; e.target.src="/generic_person.jpg"}}
									/>
									<h1>{this.state.profile.name}</h1>

									<img className='school' src={this.state.profile.school.logoUrl} alt="Can't display"/>
									<h2>{this.state.profile.school.name}</h2>
								</div>
								<div className='col-lg-4'>
									<FadeInOutHandleState condition={this.state.profile!==null && this.props.currentUser!==null && this.state.profile._id !== this.props.currentUser._id}>
										<div style={{margin: '0 55px'}}>
											<Link to={'/message/' + this.state.profile._id}>
												<button className='white-bc black-c'><i className="far fa-comment"></i> Message</button>
											</Link>
											{this.props.currentUser.friends.includes(this.state.profile._id) ?
												<button onClick={() => this.props.toggleFriend(true, this.state.profile._id)} 
													className='white-bc red-c'><i className="fas fa-minus"></i> UnFollow</button>
											:
												<button onClick={() => this.props.toggleFriend(false, this.state.profile._id)} 
													className='blue-bc black-c'><i className="fas fa-plus"></i> Follow</button>
											}
										</div>
									</FadeInOutHandleState>
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
									isCurrentUserViewing={this.props.currentUser !==null && this.state.profile._id === this.props.currentUser._id}
									currentUser={this.props.currentUser}
									addLink={(classID) => this.addLink(classID)}
									removeLink={(classID) => this.removeLink(classID)}
								/>
							</div>
							<div className='col-lg-8'>
								{this.props.currentUser._id === this.state.profile._id ? 
									<PostCreator reloadFeed={() => this.getUserPosts()} currentUser={this.props.currentUser}/>
									: null
								}
								<div className='feed-container'>
									<Feed 
										feedData={this.state.postData} 
										currentUser={this.props.currentUser}
									/>
								</div>
							</div>
						</div>
						{this.state.showNewLinkForm  ?
							<LinkSelector
								otherUserID={this.state.profile._id}
								linkClass={this.state.semesters[this.state.currSemesterIndex].classes[this.state.selectedClassIndex]}
								currentUser={this.props.currentUser}
								hideForm={() => this.showLinkSelector(false)}
							/>
						: null
						}
					</div>
				: this.getProfileData()}
				<FadeInOutHandleState condition={this.state.showNewSem}>
					<SemesterCreator
						currentUser={this.props.currentUser} 
						hideNewSemForm={() => this.showNewSem(false)}
						updateData={this.state.editSemMode ? this.state.semesters[this.state.currSemesterIndex] : null}
					/>
				</FadeInOutHandleState>

			</React.Fragment>
		);
	}
}



export default ProfilePage;