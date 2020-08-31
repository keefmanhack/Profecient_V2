import React from 'react';
import {Link} from "react-router-dom";

import Header from './header';
import {FadeInOut_HandleState} from './CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import {NewAssignment} from './AssignmentDashboard';
import Agenda from './Agenda';
import Feed from './feed';
import PostCreator from './PostCreator';


class Home extends React.Component{
	constructor(props){
		super(props);

		this.showNewAssForm = this.showNewAssForm.bind(this);

		this.state = {
			showNewAssignmentForm: false,
			classes: ['Algebra', 'Geometry', 'Geology', 'Philosophy', 'Chemistry', 'Biology', 'English', 'Political Science'],
			selectedIndex: null,
			userName: 'Keefer',
		}
	}

	showNewAssForm(val){
		this.setState({
			showNewAssignmentForm: val,
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
				  	<div className="row" style={this.state.showNewAssignmentForm ? {opacity: .7, transition: '.3s'} : null}>
					    <div className='col-lg-4 left'>
						    <AssignmentDashboard  showNewAssForm={(val) => this.showNewAssForm(val)}/>
							<Agenda />
					    </div>
					    <div className='col-lg-8 right'>
							<PostCreator firstName={this.props.currentUser.firstName} />
							<Feed />
					    </div>
					</div>
					<FadeInOut_HandleState condition={this.state.showNewAssignmentForm}>
						<NewAssignment 
							selectedIndex={this.props.selectedIndex} 
							handleClassClick={(i) => this.handleClassClick(i)} 
							showNewAssForm={(val) => this.showNewAssForm(val)} 
							classes={this.state.classes}
						/>
					</FadeInOut_HandleState>
				</div>
			</React.Fragment>
		);
	}
}

export default Home;