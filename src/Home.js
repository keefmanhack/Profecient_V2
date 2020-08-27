import React from 'react';
import {Link} from "react-router-dom";

import Header from './header';
import {FadeInOut_HandleState} from './CustomTransition';
import AssignmentDashboard from './AssignmentDashboard';
import {NewAssignment} from './AssignmentDashboard';
import Agenda from './Agenda';
import Feed from './feed';


class Home extends React.Component{
	constructor(props){
		super(props);

		this.showNewAssForm = this.showNewAssForm.bind(this);

		this.state = {
			showNewAssignmentForm: false,
			classes: ['Algebra', 'Geometry', 'Geology', 'Philosophy', 'Chemistry', 'Biology', 'English', 'Political Science'],
			selectedIndex: null,
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
					    	<div className="make-post mont-font">
					    		<h5>Keefer, what happened today in class?</h5>
						        <p><span className='textarea' role='textbox' contenteditable='true'></span></p>
								<button><i class="fas fa-camera-retro"></i></button>
								<button className='submit'>Submit</button>
					      	</div>
							<div className="feed-data">
								<Feed />
							</div>
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