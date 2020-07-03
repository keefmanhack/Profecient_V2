import React from 'react';
import AssignmentDashboard from './AssignmentDashboard';
import {NewAssignment} from './AssignmentDashboard';
import Agenda from './Agenda';
import Feed from './feed'


class App extends React.Component{
	constructor(props){
		super(props);

		this.handleNewAssignment = this.handleNewAssignment.bind(this);

		this.state = {
			showNewAssignmentForm: false,
			classes: ['Algebra', 'Geometry', 'Geology', 'Philosophy', 'Chemistry', 'Biology', 'English', 'Political Science'],
			selectedIndex: null,
		}
	}

	handleNewAssignment(){
		this.setState({
			showNewAssignmentForm: true,
		})
	}

	hideNewAssignment(){
		this.setState({
			showNewAssignmentForm: false,
		})
	}

	handleClassClick(i){
		this.setState({
			selectedIndex: i,
		})
	}

	render(){
		let newAssignment;
		if(this.state.showNewAssignmentForm){
			newAssignment = <NewAssignment selectedIndex={this.props.selectedIndex} handleClassClick={(i) => this.handleClassClick(i)} hideNewAssignment={() => this.hideNewAssignment()} classes={this.state.classes}/>
		}

		return(
		    <div className="page-container">
		      <div className="row" style={this.state.showNewAssignmentForm ? {opacity: .6} : null}>
		        <div className="col-lg-2 menu" style={{padding: 0, height: 'fit-content'}}>
		          <ul style={{padding: 0, margin: 0}}>
		          	<li style={{listStyle: 'none'}}>
		          		<button> 
							Classes
		          		</button>
		          	</li>
		          	<li>
		          		<button> 
							Calendar
		          		</button>
		          	</li>
		          	<li>
		          		<button> 
							Message Center
		          		</button>
		          	</li>
		          </ul>
		        </div>
		        <div className="col-lg-6 feed-container">
		          <div className="make-post">
		            <p><span className='textarea' role='textbox' contenteditable='true'></span></p>
					<button><i class="fas fa-camera-retro"></i></button>
					<button className='submit'>Submit</button>
		          </div>
		          <div className="feed-data">
		            <Feed />
		          </div>
		        </div>
		        <div className="col-lg-4 dash">
		          <div className="assignments-container">
		            <AssignmentDashboard  handleNewAssignment={() => this.handleNewAssignment()}/>
		          </div>
		          <div className="agenda">
		            <Agenda />
		          </div>

		        </div>
		      </div>
		      {newAssignment}
		    </div>
  		);
	}
  
}

export default App;
