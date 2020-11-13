import React from 'react';

import Header from '../Shared Resources/Header/header';
import {FadeInOutHandleState} from '../Shared Resources/Effects/CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import Agenda from './Agenda/Agenda';
import Feed from '../Shared Resources/feed/feed';
import PostCreator from '../Shared Resources/PostCreator';
import Loader from '../Shared Resources/Effects/loader'

import UserRequests       from '../../APIRequests/User';
import PostRequests       from '../../APIRequests/Post';
import UserVerifier from '../../APIRequests/User Verifier/UserVerifier';


class Home extends React.Component{
	constructor(props){
		super(props);

		//setUpAPIRequests
		this.userReq=null;
		this.postReq=null;
		this.uV = new UserVerifier();

		this.state = {
			postData: null,
			currentUser: null,
		}
	}

	async componentDidMount(){
		try{
			const user = await this.uV.getCurrUser();
			this.userReq = new UserRequests(user._id);
			this.postReq = new PostRequests(user._id);
			this.setState({currentUser: user});
			this.getFriendsPosts();
		}catch(err){
			console.log(err);
			this.props.history.push('/login');
		}
	}

	async getFriendsPosts(){
		this.setState({postData: await this.postReq.getFriendsPost()});
	}
	
	render(){
		if(!this.state.currentUser){
			return (<Loader/>)
		}else{
			return(
				<React.Fragment>
					<Header updateCurrentUser={() => this.props.updateCurrentUser()} getUpcommingAssignments={() => this.getUpcommingAssignments()} currentUser={this.state.currentUser}/>
					<div className='page-container black-bc'>
						  <div 
							  className="row" 
							  style={this.state.showNewAssignmentForm || this.state.showNewAgForm ? {opacity: .3, transition: '.3s'} : {transition: '.3s'}}
						  >
							<div className='col-lg-4 left'>
								<AssignmentDashboard
									currentUserID={this.state.currentUser._id}
								/>
								<Agenda 
									currentUserID={this.state.currentUser._id}
								/>
							</div>
							<div className='col-lg-8 right'>
								<PostCreator reloadFeed={() => this.getFriendsPosts()} currentUser={this.state.currentUser}/>
								<div style={{position: 'relative', height: '100%', width: '100%', borderRadius: 5}}>
									{this.state.postData ? 
										<Feed 
											reloadPosts={() => this.getFriendsPosts()} 
											feedData={this.state.postData} 
											currentUser={this.state.currentUser}
											noFeedDataMsg={"Sorry no posts to display. Find friends to see their posts!"}
										/>
									:
										<Loader/>
									}
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default Home;