import React from 'react';
import {FadeDownUp_HandleState} from './CustomTransition';

class ClassView extends React.Component{
	constructor(props){
		super(props);

		this.state={
			testData: {
				name: 'Freshman 1st Semester',
				classes: [
					{
						name: 'Algebra',
						instructor: 'Dr. Lee',
						location: 'Zurn 101',
						startTime: '10:15AM',
						endTime: '11:05AM',
						assignments: [
							{
								name: 'Hw1',
								dueDate: new Date(2020, 5, 10),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: false,
							},
							{
								name: 'Hw1',
								dueDate: new Date(),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: true,
							}
						]
					},
					{
						name: 'Algebra',
						instructor: 'Dr. Lee',
						location: 'Zurn 101',
						startTime: '10:15AM',
						endTime: '11:05AM',
						assignments: [
							{
								name: 'Hw1',
								dueDate: new Date(),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: false,
							},
							{
								name: 'Hw1',
								dueDate: new Date(),
								description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint cum iure, velit soluta. Sapiente sint unde quasi sequi reiciendis, eaque molestias, similique saepe doloribus consequatur, ratione doloremque odio rerum tempora!',
								completed: true,
							}
						]
					}
				]
			}
		}
	}

	render(){
		const classes = this.state.testData.classes.map((data, index) =>
			<ClassCon  
				name={data.name}
				instructor={data.instructor}
				location={data.location}
				startTime={data.startTime}
				endTime={data.endTime}
				assignments={data.assignments}
				key={index}
			/>
		)

		return(
			<div className='class-view-container'>
				<div className='semester-container'>
					<h1>{this.state.testData.name}</h1>
					<button>...</button>
				</div>
				<h5>{this.state.testData.classes.length} Classes</h5>
				<hr/>
				<div style={{minHeight: 150, maxHeight: 250, overflow: 'scroll'}}>
					{classes}
				</div>
				
				<div className='edit-sem-con'>
					<button>Add Class</button>
					<button>New Semester</button>
					<button>Select Semester ></button>

					<div>
						<button>Freshman <span>.</span></button>
						<button>Sophomore</button>
						<button>Junior</button>
					</div>
				</div>
			</div>
		);
	}
}

class ClassCon extends React.Component{
	constructor(props){
		super(props);

		this.state={
			showAssignment: false,
		}
	}

	toggleShowAssignment(){
		const showAssCopy = this.state.showAssignment;

		this.setState({
			showAssignment: !showAssCopy,
		})
	}

	render(){

		const dropDownDis = this.state.showAssignment ? <i class="fas fa-chevron-up"></i> : <i class="fas fa-chevron-down"></i>;
		return(
			<div className='class-container'>
				<button className='link' >Link</button>
				<h1>{this.props.name}</h1>
				<h2>{this.props.instructor}</h2>
				<h3>{this.props.location}</h3>
				<h4>{this.props.startTime} - {this.props.endTime}</h4>
				<button className='see-assign' onClick={() => this.toggleShowAssignment()}>
					{dropDownDis} {this.state.showAssignment ? 'Close' : 'See'} Assignments 
				</button>
				<div style={{position: 'relative'}}>
					<FadeDownUp_HandleState condition={this.state.showAssignment}>
						<AssignContainer assignments={this.props.assignments}/>
					</FadeDownUp_HandleState>
				</div>
			</div>
		);
	}
}

function AssignContainer(props){
	const upComAssign = props.assignments.map((data, index) =>
		data.completed ? null : 
			<Assign
				name={data.name}
				dueDate={data.dueDate}
				description={data.description}
				style={{background: findColor(data.dueDate)}}
			/>
	);

	const compAssign = props.assignments.map((data, index) =>
		data.completed ? 
			<Assign
				name={data.name}
				dueDate={data.dueDate}
				description={data.description}
				key={index}
				style={{background: 'rgb(211, 227, 246)'}}
			/>
		: null
	);

	return(
		<div className='assign-container'>
			<h5>Upcomming</h5>
			<hr/>
			{upComAssign}
			<h5 style={{marginTop: 10}}>Completed</h5>
			<hr/>
			{compAssign}
		</div>
	);
}

function Assign(props){

	return(
		<div style={props.style} className='assign'>
			<h1>{props.name}</h1>
			<h2>{dueDateString(props.dueDate)}</h2>
			<button>...</button>
			<p>{props.description}</p>
		</div>
	);
}

function dueDateString(dueDate){
	const today = new Date();

	if(today.getFullYear() === dueDate.getFullYear()){
		if(today.getMonth() === dueDate.getMonth()){
			if(today.getDate()-dueDate.getDate() === 0){
				return 'Today';
			}else if(today.getDate()-dueDate.getDate() === 1){
				return 'Tomorrow';
			}else if(today.getDate()-dueDate.getDate() < 7){
				return today.getDate()-dueDate.getDate() + 'days';
			}
		}
	}

	return dueDate.toDateString();
}

function findColor(dueDate){
	const today = new Date();

	if(today.getFullYear() === dueDate.getFullYear()){
		if(today.getMonth() === dueDate.getMonth()){
			if(today.getDate()-dueDate.getDate() === 0){
				return 'rgb(255, 206, 206)'; //red
			}else if(today.getDate()-dueDate.getDate() < 7){
				return 'rgb(249, 231, 205)'; //orange
			}
		}
	}
	return 'rgb(210, 244, 219)'; //green
}

export default ClassView;