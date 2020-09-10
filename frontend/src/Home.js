import React from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

import Header from './header';
import {FadeInOut_HandleState} from './CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import {NewAssignment} from './AssignmentDashboard';
import Agenda from './Agenda';
import {NewAgendaItem} from './Agenda';
import Feed from './feed';
import PostCreator from './PostCreator';


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
		}
	}

	componentDidMount(){
		this.getTodaysEvents();
		this.getClassData();
		this.getUpcommingAssignments();
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

	sendNewAgendaItem(data){
		const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id + '/' + 'agenda';

		axios.post(endPoint, data)
		.then((response) => {
			this.setState({
				agendaItemSentSuccessful: true,
			})
			this.getTodaysEvents();
		}).catch((error) => {
			console.log(error);
		});
	}

	getUpcommingAssignments(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/assignment/upcomming')
	    .then(res => {
			this.setState({
				upcommingAss: res.data
			})
		})
	}

	deleteAssignment(i){
		const assID = this.state.upcommingAss[i]._id;
		const classIndex = findClassIndex(assID, this.state.currSemester.classes);
		alert('item being deleted');

		const endPoint = 'http://localhost:8080/classes/' + this.state.currSemester.classes[classIndex]._id + '/assignment/' + assID;

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
			this.deleteAssignment(this.state.editIndex);
		}
		alert('item being created');

		const endPoint = 'http://localhost:8080/classes/' + this.state.currSemester.classes[this.state.selectedIndex]._id + '/assignment';

		axios.post(endPoint, data)
		.then((response) => {
			this.setState({
				newAssSentSuccessful: true,
				selectedIndex: null,
			})
			this.getClassData();
		}).catch((error) => {
			console.log(error);
		});
	}

	toggleAssCompleted(id, isCompleted){
		const endPoint = 'http://localhost:8080/assignment/' + id;

		axios.put(endPoint, {complete: isCompleted})
		.then((response) => {
			console.log(response);
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
		})
	}

	editAssignment(i){
		const classIndex = findClassIndex(this.state.upcommingAss[i]._id, this.state.currSemester.classes)
		console.log(classIndex)
		this.setState({
			editIndex: i,
			showNewAssignmentForm: true,
			selectedIndex: classIndex,
		})
	}



	render(){
		return(
			<React.Fragment>
				<Header/>
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
						    	deleteAssignment={(i) => this.deleteAssignment(i)}
						    />
							<Agenda 
								showNewAgForm={() => this.showNewAgForm(true)}
								agendaItems={this.state.agendaItems}
							/>
					    </div>
					    <div className='col-lg-8 right'>
							<PostCreator currentUser={this.props.currentUser}/>
							<Feed />
					    </div>
					</div>
					<FadeInOut_HandleState condition={this.state.showNewAssignmentForm}>
						<NewAssignment 
							selectedIndex={this.state.selectedIndex} 
							handleClassClick={(i) => this.handleClassClick(i)} 
							hideNewAssForm={() => this.showNewAssForm(false)} 
							classes={this.state.currSemester.classes}
							sendData={(data) => this.sendAssignment(data)}
							success={this.state.newAssSentSuccessful}
							editData={this.state.upcommingAss[this.state.editIndex]}
						/>
					</FadeInOut_HandleState>
					<FadeInOut_HandleState condition={this.state.showNewAgForm}>
						<NewAgendaItem
							hideNewAgForm={() => this.showNewAgForm(false)}
							currentUser={this.props.currentUser}
							sendData={(data) => this.sendNewAgendaItem(data)}
							success={this.state.agendaItemSentSuccessful}
						/>
					</FadeInOut_HandleState>
					
				</div>
			</React.Fragment>
		);
	}
}

	
function findClassIndex(id, classes){
	let returnVal = null;

	for(let i =0; i< classes.length; i++){
		classes[i].assignments.forEach(function(ass){
			if(ass === id){
				returnVal = i;
			}
		})
	}

	return returnVal;
}

export default Home;