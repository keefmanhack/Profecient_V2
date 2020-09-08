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
			classes: ['Algebra', 'Geometry', 'Geology', 'Philosophy', 'Chemistry', 'Biology', 'English', 'Political Science'],
			selectedIndex: null,
			agendaItems: [],
			agendaItemSentSuccessful: false,
		}
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
	componentDidMount(){
		this.getTodaysEvents();
	}



	showNewAssForm(val){
		this.setState({
			showNewAssignmentForm: val,
		})
	}

	showNewAgForm(val){
		this.setState({
			showNewAgForm: val,
		})
	}

	handleClassClick(i){
		this.setState({
			selectedIndex: i,
		})
	}
	render(){
		return(
			<React.Fragment>
				<Header/>
				<div className='page-container black-bc'>
				  	<div 
				  		className="row" 
				  		style={this.state.showNewAssignmentForm || this.state.showNewAgForm ? {opacity: .7, transition: '.3s'} : null}
				  	>
					    <div className='col-lg-4 left'>
						    <AssignmentDashboard  showNewAssForm={() => this.showNewAssForm(true)}/>
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
							selectedIndex={this.props.selectedIndex} 
							handleClassClick={(i) => this.handleClassClick(i)} 
							hideNewAssForm={() => this.showNewAssForm(false)} 
							classes={this.state.classes}
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

export default Home;