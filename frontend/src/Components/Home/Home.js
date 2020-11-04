import React from 'react';

import Header from '../Shared Resources/header';
import {FadeInOutHandleState} from '../Shared Resources/Effects/CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import Agenda from './Agenda/Agenda';
import Feed from '../Shared Resources/feed/feed';
import PostCreator from '../Shared Resources/PostCreator';
import Loader from '../Shared Resources/Effects/loader'

import UserRequests       from '../APIRequests/User';
import PostRequests       from '../APIRequests/Post';


class Home extends React.Component{
	constructor(props){
		super(props);

		//setUpAPIRequests
		this.userReq   = new UserRequests();
		this.postReq   = new PostRequests(this.props.currentUser._id);

		this.state = {
			postData: null,
		}
	}

	async componentDidMount(){
		this.getFriendsPosts();
	}

	async getFriendsPosts(){
		this.setState({postData: await this.postReq.getFriendsPost()});
	}
	
	render(){
		return(
			<React.Fragment>
				<Header updateCurrentUser={() => this.props.updateCurrentUser()} getUpcommingAssignments={() => this.getUpcommingAssignments()} currentUser={this.props.currentUser}/>
				<div className='page-container black-bc'>
				  	<div 
				  		className="row" 
				  		style={this.state.showNewAssignmentForm || this.state.showNewAgForm ? {opacity: .3, transition: '.3s'} : {transition: '.3s'}}
				  	>
					    <div className='col-lg-4 left'>
						    <AssignmentDashboard
						    	currentUserID={this.props.currentUser._id}
						    />
							<Agenda 
								currentUserID={this.props.currentUser._id}
							/>
					    </div>
					    <div className='col-lg-8 right'>
							<PostCreator reloadFeed={() => this.getFriendsPosts()} currentUser={this.props.currentUser}/>
							<div style={{position: 'relative', height: '100%', width: '100%', borderRadius: 5}}>
								{this.state.postData ? 
									<Feed 
										reloadPosts={() => this.getFriendsPosts()} 
										feedData={this.state.postData} 
										currentUser={this.props.currentUser}
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

export default Home;