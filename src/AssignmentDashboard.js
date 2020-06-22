import React from 'react';

class AssignmentDashboard extends React.Component{
	render(){
		return(
			<div className='assignment-dashboard'>
				<h1>Upcomming</h1>
				<button id='add-assignment'>+</button>
				<hr/>
				<Assignment backgroundColor={{backgroundColor:'#FFCECE'}} dueDate='Tomorrow' name='Algebra HW'/>
				<Assignment backgroundColor={{backgroundColor:'#F9E7CD'}} dueDate='Wed.' name='Geometry HW'/>
				<Assignment backgroundColor={{backgroundColor:'#D3E3F6'}} dueDate='Thurs.' name='English Paper'/>
				<button className='see-more'>See More</button>
				<hr/>
				<button id='add-todo'>+</button>
				<ToDo text='I need to clean my car'/>
				<ToDo text='walk the dog'/>
				<ToDo text='walk the dog'/>
				<ToDo text='make my bed later'/>
				<button className='see-more-to-do'>See More</button>

			</div>	
		);
	}
}

class Assignment extends React.Component{
	render(){
		return(
			<div style={this.props.backgroundColor} className='assignment'>
				<div className='row'>
					<div className='col-lg-7'>
						{this.props.name}
					</div>
					<div className='col-lg-3'>
						{this.props.dueDate}
					</div>
					<div className='col-lg-2'>
						<button>...</button>
					</div>
				</div>
			</div>
		);
	}
}

class ToDo extends React.Component{
	render(){
		return(
			<div className='to-do'>
				<h1>{this.props.text}</h1>
			</div>
		);
	}
}

export default AssignmentDashboard;