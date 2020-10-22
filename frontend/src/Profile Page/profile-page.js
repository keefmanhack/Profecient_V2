import React from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

import Feed from '../Shared Resources/feed/feed';
import ClassView from './Class View/ClassView';
import SemesterCreator from './Semester Creator/SemesterCreator';
import {FadeInOutHandleState} from '../Shared Resources/Effects/CustomTransition';
import Header from '../Shared Resources/header';
import PostCreator from '../Shared Resources/PostCreator';
import Loader from '../Shared Resources/Effects/loader';

import UserRequests from '../APIRequests/User';
import PostRequests from '../APIRequests/Post';

import './profile-page.css';

class ProfilePage extends React.Component{
	constructor(props){
		super(props);

		this.userReq = new UserRequests(this.props.foundUser);
		this.currUserReq = new UserRequests(this.props.currentUser._id);
		this.postReq = new PostRequests(this.props.foundUser);

		this.state = {
			postData: null,
			profile: null,
			followAction: false,
		}
	}

	componentDidMount(){
		this.getProfileData();
	}

	getProfileData(){
		this.getUserPosts();
		this.getRequestedUser();
	}

	async getRequestedUser(){
		this.setState({profile: await this.userReq.getUser()})
	}

	async getUserPosts(){
		this.setState({postData: await this.postReq.getPosts()});
	}

	async toggleFollowing(possibleFollowingID){
		await this.currUserReq.toggleUserFollowing(possibleFollowingID);
		await this.props.reloadCurrUser();
		this.setState({followAction: false});
	}

	render(){
		let currSemExists = this.state.currSemesterIndex >-1;
		const followAcStyle = {opacity: .5, cursor: 'default'};
		return (
			<React.Fragment>
				<Header currentUser={this.props.currentUser}/>
				{this.state.profile !== null ? 
					<div className='page-container profile-page' style={this.state.showNewSem || this.state.showNewLinkForm ? {opacity: .5}: null}>
						<div className='top white-c'>
							<div className='row'>
								<div className='col-lg-8'>
									<div className='basic-info'>
										<div className='name-school'>
											<img 
												src={"https://proficient-assets.s3.us-east-2.amazonaws.com/" + this.state.profile.profilePictureURL}
												alt="Not found"
												className='profile-pic'
												onError={(e)=>{e.target.onerror = null; e.target.src="/generic_person.jpg"}}
											/>
											<h1>{this.state.profile.name}</h1>
											<div className='school'>
												<img src={this.state.profile.school.logoUrl} alt="Can't display" onError={(e)=>{e.target.onerror = null; e.target.src="/generic_school.jpg"}}/>
												<h2>{this.state.profile.school.name}</h2>
											</div>
										</div>
										<div className='follow-count'>
											<div style={{display: 'inline-block', marginRight: 15}}>
												<h4 className='blue-c'>{this.state.profile.following.length}</h4>
												<h4 className='muted-c'>Following</h4>
											</div>
											<div style={{display: 'inline-block'}}>
												<h4 className='blue-c'>{this.state.profile.followers.length}</h4>
												<h4 className='muted-c'>Followers</h4>
											</div>
										</div>
									</div>
								</div>
								<div className='col-lg-4'>
									<FadeInOutHandleState condition={this.state.profile!==null && this.props.currentUser!==null && this.state.profile._id !== this.props.currentUser._id}>
										<div style={{margin: '0 55px'}}>
											<Link to={'/message/' + this.state.profile._id}>
												<button className='white-bc black-c'><i className="far fa-comment"></i> Message</button>
											</Link>
											{this.props.currentUser.following.includes(this.state.profile._id) ?
												<button
													disabled={this.state.followAction}
													style={this.state.followAction ? {opacity: .5, cursor: 'default'} : null} 
													onClick={() => { this.setState({followAction: true}); this.toggleFollowing(this.state.profile._id)}} 
													className='white-bc red-c'><i className="fas fa-minus"></i> UnFollow
												</button>
											:
												<button 
													disabled={this.state.followAction}
													style={this.state.followAction ? followAcStyle : null} 
													onClick={() => { this.setState({followAction: true}); this.toggleFollowing(this.state.profile._id)}}
													className='blue-bc black-c'><i className="fas fa-plus"></i> Follow
												</button>
											}
										</div>
									</FadeInOutHandleState>
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-lg-4 left'>
								<ClassView 
									isCurrentUserViewing={this.props.currentUser !==null && this.state.profile._id === this.props.currentUser._id}
									currentUser={this.props.currentUser}
									otherUserID={this.state.profile._id}
								/>
							</div>
							<div className='col-lg-8'>
								{this.props.currentUser._id === this.state.profile._id ? 
									<PostCreator reloadFeed={() => this.getUserPosts()} currentUser={this.props.currentUser}/>
									: null
								}
								<div className='feed-container'>
									{this.state.postData ? 
										<Feed 
											reloadPosts={() => this.getUserPosts()} 
											feedData={this.state.postData} 
											currentUser={this.props.currentUser}
											noFeedDataMsg={"Sorry no posts to display."}
										/>
									:
										<Loader/>
									}
								</div>
							</div>
						</div>
					</div>
				: this.getProfileData()}
			</React.Fragment>
		);
	}
}



export default ProfilePage;