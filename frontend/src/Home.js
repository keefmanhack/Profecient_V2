import React from 'react';
import {Link} from "react-router-dom";

import Header from './header';
import {FadeInOut_HandleState} from './CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import {NewAssignment} from './AssignmentDashboard';
import Agenda from './Agenda';
import {NewAgendaItem} from './Agenda';
import Feed from './feed';
import PostCreator from './PostCreator';
import Loader from './loader';


class Home extends React.Component{
	constructor(props){
		super(props);

		this.showNewAssForm = this.showNewAssForm.bind(this);

		this.state = {
			showNewAssignmentForm: false,
			showNewAgForm: false,
			classes: ['Algebra', 'Geometry', 'Geology', 'Philosophy', 'Chemistry', 'Biology', 'English', 'Political Science'],
			selectedIndex: null,
		}
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
		if(this.props.currentUser ===null){
			return(
				<Loader/>
			)
		}else{
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
								<Agenda showNewAgForm={() => this.showNewAgForm(true)}/>
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
							/>
						</FadeInOut_HandleState>
						
					</div>
				</React.Fragment>
			);
		}
	}
}

export default Home;