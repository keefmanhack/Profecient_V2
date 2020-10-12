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


class Home extends React.Component{
	constructor(props){
		super(props);

		this.showNewAssForm = this.showNewAssForm.bind(this);

		this.state = {
			showNewAssignmentForm: false,
			showNewAgForm: false,
			currSemester: {},
			selectedIndex: null,
			newAssSentSuccessful: false,
			agendaItems: [],
			agendaItemSentSuccessful: false,
			upcommingAss: [],
			editIndex: null,
			postData: [],
			selectedAgendaIndex: null,
		}
	}

	componentDidMount(){
		this.getTodaysEvents();
		// this.getClassData();
		this.getUpcommingAssignments();
		this.getFriendsPosts();
	}

	getClassData(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/semesters/current')
	    .then(res => {
			this.setState({
				currSemester: res.data
			})
		})
	}

	getTodaysEvents(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/agenda/today')
	    .then(res => {
			this.setState({
				agendaItems: res.data
			})
		})
	}

	getFriendsPosts(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/friends/posts')
	    .then(res => {
			this.setState({
				postData: res.data,
			})
		})
	}

	sendNewAgendaItem(data){
		const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id + '/agenda';

		axios.post(endPoint, data)
		.then((response) => {
			this.setState({
				agendaItemSentSuccessful: true,
				selectedAgendaIndex: null,
			})
			this.getTodaysEvents();
		}).catch((error) => {
			console.log(error);
		});
	}

	updateAgItem(data){
		const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id + '/agenda/' + this.state.agendaItems[this.state.selectedAgendaIndex]._id;

		axios.put(endPoint, data)
		.then((response) => {
			this.setState({
				agendaItemSentSuccessful: true,
				selectedAgendaIndex: null,
			})
			this.getTodaysEvents();
		}).catch((error) => {
			console.log(error);
		});
	}

	deleteAgItem(){
		const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id + '/agenda/' + this.state.agendaItems[this.state.selectedAgendaIndex]._id;

		axios.delete(endPoint)
		.then((response) => {
			this.setState({
				agendaItemSentSuccessful: true,
				selectedAgendaIndex: null,
			})
			this.getTodaysEvents();
		}).catch((error) => {
			console.log(error);
		});
	}

	getUpcommingAssignments(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/assignment/upcomming')
	    .then(res => {
	    	this.getClassData();
			this.setState({
				upcommingAss: res.data
			})
		})
	}

	deleteAssignment(assID){
		console.log(assID);
		console.log(this.state.currSemester);
		const classIndex = findClassIndex(assID, this.state.currSemester.classes);

		const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id +'/classes/' + this.state.currSemester.classes[classIndex]._id + '/assignment/' + assID;

		axios.delete(endPoint)
		.then((response) => {
			this.setState({
				editIndex: null,
				selectedIndex: null,
			})
			this.getClassData();
			this.getUpcommingAssignments();
		}).catch((error) => {
			console.log(error);
		});
	}

	sendAssignment(data){
		if(this.state.editIndex || this.state.editIndex===0){
			this.deleteAssignment(this.state.currSemester.classes[this.state.selectedIndex].assignments[this.state.editIndex]._id);

		}

		const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id +'/classes/' + this.state.currSemester.classes[this.state.selectedIndex]._id + '/assignment';

		axios.post(endPoint, data)
		.then((response) => {
			this.setState({
				newAssSentSuccessful: true,
				selectedIndex: null,
			})
			this.getClassData();
			this.getUpcommingAssignments();
		}).catch((error) => {
			console.log(error);
		});
	}

	toggleAssCompleted(id, isCompleted){
		const endPoint = 'http://localhost:8080/assignment/' + id;

		axios.put(endPoint, {complete: isCompleted})
		.then((response) => {
			// console.log(response);
		}).catch((error) => {
			console.log(error);
		});
	}

	showNewAssForm(val){
		this.setState({
			showNewAssignmentForm: val,
			newAssSentSuccessful: false,
			selectedIndex: null,
		})

		if(val===false){
			this.getUpcommingAssignments();
			this.setState({
				editIndex: null,
			})
		}
	}

	showNewAgForm(val){
		this.setState({
			showNewAgForm: val,
			agendaItemSentSuccessful: false,
			selectedIndex: null,
		})

		if(val===false){
			this.getTodaysEvents();
		}
	}

	handleClassClick(i){
		this.setState({
			selectedIndex: i,
			showNewAssignmentForm: true,
		})
	}

	editAssignment(i){
		const classIndex = findClassIndex(this.state.upcommingAss[i]._id, this.state.currSemester.classes)
		this.setState({
			editIndex: i,
			showNewAssignmentForm: true,
			selectedIndex: classIndex,
		})
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
						<NewAssignment 
							selectedIndex={this.state.selectedIndex} 
							handleClassClick={(i) => this.handleClassClick(i)} 
							hideNewAssForm={() => this.showNewAssForm(false)} 
							classes={this.state.currSemester.classes}
							sendData={(data) => this.sendAssignment(data)}
							success={this.state.newAssSentSuccessful}
							editData={this.state.upcommingAss[this.state.editIndex]}
						/>
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

	
function findClassIndex(id, classes){
	for(let i =0; i< classes.length; i++){
		for(let j =0; j<classes[i].assignments.length; j++){
			const ass = classes[i].assignments[j];
			if(ass === id){
				return i;
			}
		}
	}

	return -1;
}

export default Home;