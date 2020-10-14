import React from 'react';
// import {Link} from "react-router-dom";
import axios from 'axios';

import Header from '../Shared Resources/header';
import {FadeInOutHandleState} from '../Shared Resources/Effects/CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import {NewAssignment} from './AssignmentDashboard';
import Agenda from './Agenda/Agenda';
import {NewAgendaItem} from './Agenda/Agenda';
import Feed from '../Shared Resources/feed';
import PostCreator from '../Shared Resources/PostCreator';

import UserRequests       from '../APIRequests/User';
import AgendaRequests     from '../APIRequests/Agenda';
import PostRequests       from '../APIRequests/Post';



class Home extends React.Component{
	constructor(props){
		super(props);

		//setUpAPIRequests
		this.userReq   = new UserRequests();
		this.agendaReq = new AgendaRequests(this.props.currentUser._id);
		this.postReq   = new PostRequests(this.props.currentUser._id);

		this.state = {
			showNewAgForm: false,
			agendaItems: [],
			agendaItemSentSuccessful: false,
			postData: [],
			selectedAgendaIndex: null,
		}
	}

	async componentDidMount(){
		const todaysEvents = await this.agendaReq.getTodaysEvents();
		const friendsPosts = await this.postReq.getFriendsPost();

		this.setState({
			agendaItems: todaysEvents,
			postData: friendsPosts,
		})
	}

	async sendNewAgendaItem(data){
		const response = await this.agendaReq.postNewItem(data);
		if(response){
			this.resetAgendaState();
			await this.agendaReq.getTodaysEvents();
		}
	}

	async updateAgItem(data){
		const agItemID = this.state.agendaItems[this.state.selectedAgendaIndex]._id;
		const response = await this.agendaReq.updateItem(agItemID, data);
		if(response){
			this.resetAgendaState();
			await this.agendaReq.getTodaysEvents();
		}
	}

	resetAgendaState(){
		this.setState({
			agendaItemSentSuccessful: true,
			selectedAgendaIndex: null,
		})
	}

	async deleteAgItem(){
		const agItemID = this.state.agendaItems[this.state.selectedAgendaIndex]._id;
		const response = await this.agendaReq.deleteItem(agItemID);
		if(response){
			this.resetAgendaState();
			await this.agendaReq.getTodaysEvents();
		}
	}

	async showNewAgForm(val){
		this.setState({
			showNewAgForm: val,
			agendaItemSentSuccessful: false,
			selectedIndex: null,
		})

		if(val===false){
			await this.agendaReq.getTodaysEvents();
		}
	}

	agendaItemClicked(i){
		this.setState({
			selectedAgendaIndex: i,
			showNewAgForm: true
		})
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
						    	showNewAssForm={() => this.showNewAssForm(true)}
						    	assignments={this.state.upcommingAss}
						    	toggleCompleted={(id, isCompleted) => this.toggleAssCompleted(id, isCompleted)}
						    	editAssignment={(i) => this.editAssignment(i)}
						    	deleteAssignment={(assID) => this.deleteAssignment(assID)}
						    />
							<Agenda 
								showNewAgForm={() => this.showNewAgForm(true)}
								agendaItems={this.state.agendaItems}
								handleAgendaItemClick={(i) => this.agendaItemClicked(i)}
							/>
					    </div>
					    <div className='col-lg-8 right'>
							<PostCreator reloadFeed={() => this.getFriendsPosts()} currentUser={this.props.currentUser}/>
							<Feed feedData={this.state.postData} currentUser={this.props.currentUser}/>
					    </div>
					</div>
					<FadeInOutHandleState condition={this.state.showNewAssignmentForm}>
					
					</FadeInOutHandleState>
					<FadeInOutHandleState condition={this.state.showNewAgForm}>
						<NewAgendaItem
							hideNewAgForm={() => this.showNewAgForm(false)}
							currentUser={this.props.currentUser}
							sendData={(data) => this.sendNewAgendaItem(data)}
							update={(data) => this.updateAgItem(data)}
							delete={() => this.deleteAgItem()}
							success={this.state.agendaItemSentSuccessful}
							updateItem={this.state.selectedAgendaIndex !==null ? this.state.agendaItems[this.state.selectedAgendaIndex] : null}
						/>
					</FadeInOutHandleState>
					
				</div>
			</React.Fragment>
		);
	}
}

export default Home;