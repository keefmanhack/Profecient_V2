import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';
import {BackInOut_HandleState} from '../CustomTransition';
import SuggestedLinksContainer from './SuggestedLinks/SuggestedLinksContainer';

class SemesterCreator extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			semData: {
				name: null,
				classData: [],
			},
			currentClass: {
				name: null,
				instructor: null,
				location: null,
				daysOfWeek: [],
				time: {
					start: '2:00PM',
					end: '4:00PM',
				},
				date: {
					start: null,
					end: null,
				}
			}
		}
	}

	setTime(key, time){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy.time[key] = time;

		this.setState({
			currentClass: currentClass_copy,
		})
	}

	semName(key, text){
		if(key==="Enter"){
			const semData_copy = this.state.semData;
			semData_copy.name= text;
			this.setState({
				semData: semData_copy,
			});
		}
	}

	updateCurrent(key, text){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key] = text;

		this.setState({
			currentClass: currentClass_copy,
		});
	}

	render(){
		return(
			<div className='semester-creator-container'>
					<div>
						<h1>{this.state.semData.name} text</h1>
						<hr/>

						<ClassEditor 
							setTime={(key, time) => this.setTime(key, time)} 
							updateCurrent={(key, text) => this.updateCurrent(key, text)}
							time={this.state.currentClass.time}
						/>

						<SuggestedLinksContainer currentClass={this.state.currentClass}/>
					</div>
			</div>
		);
	}
}

class ClassEditor extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			buttons: [
				{
					text: 'M',
					selected: false,
				},
				{
					text: 'T',
					selected: false,
				},
				{
					text: 'W',
					selected: false,
				},
				{
					text: 'T',
					selected: false,
				},
				{
					text: 'F',
					selected: false,
				},
				{
					text: 'S',
					selected: false,
				},
				{
					text: 'S',
					selected: false,
				}
			]
		}
		
		this.className = React.createRef();
		this.instructor = React.createRef();
		this.location = React.createRef();
		this.startDate = React.createRef();
		this.endDate = React.createRef();
	}

	toggleSelected(i){
		const buttons_Copy = this.state.buttons;

		buttons_Copy[i].selected = !buttons_Copy[i].selected;

		this.setState({
			buttons: buttons_Copy,
		})
	}

	render(){
		const dayButtons = this.state.buttons.map((data, index) =>
			<DayButton 
				text={data.text} 
				i={index} 
				key={index} 
				toggleSelected={(i) => this.toggleSelected(i)}
				selected={this.state.buttons[index].selected}
			/>
		)

		return(
			<div className='class-editor'>
				<input 
					ref={this.className} 
					onKeyUp={() => this.props.updateCurrent('name', this.className.current.value)}  
					className='class-name' 
					type="text" 
					placeholder='Class Name'
				/>
				<div className='row instruct-loc'>
					<div className='col-lg-6'>
						<input
							onKeyUp={() => this.props.updateCurrent('instructor', this.instructor.current.value)}
							ref={this.instructor} 
							type="text" 
							placeholder='Instructor'
						/>
					</div>
					<div className='col-lg-6'>
						<input 
							ref={this.location}
							onKeyUp={() => this.props.updateCurrent('location', this.location.current.value)}
							type="text" 
							placeholder='Location'
						/>
					</div>
				</div>

				<div className='day-buttons'>
					{dayButtons}
				</div>

				<div className='row start-end-date'>
					<div className='col-lg-6'>
						<input 
							ref={this.startDate} 
							type="text" 
							placeholder='Start Date'
							onKeyUp={() => this.props.updateCurrent('date[start]', this.startDate.current.value)}
						/>
					</div>
					<div className='col-lg-6'>
						<input 
							ref={this.endDate} 
							type="text" 
							placeholder='End Date'
							onKeyUp={() => this.props.updateCurrent('date[end]', this.endDate.current.value)}
						/>
					</div>
				</div>

				<StartEndTime 
					time={this.props.time} 
					setTime={(key, time) => this.props.setTime(key, time)}
				/>
				<button className='add-class'>Add Class</button>
			</div>
		);
	}
}

function DayButton(props){
	return(
		<button 
			onClick={(i) => props.toggleSelected(props.i)}
			className={props.selected ? 'selected' : null}
		>{props.text}</button>
	);
}



class NameSemester extends React.Component{
	constructor(props){
		super(props);

		this.input = React.createRef();
	}
	render(){
		return(
			<div className='name-semester'>
				<h1>Let's Get Started</h1>
				<h2>Create your first</h2>
				<h3>SEMESTER</h3>
				<input ref={this.input} onKeyPress={(e) => this.props.semName(e.key, this.input.current.value)} type="text" placeholder='e.g. Freshman 1st Semester'/>
				<button onClick={() => this.props.semName('Enter', this.input.current.value)}>Create New Semester</button>
			</div>
		);
	}
}

function ClassItem(props){
	return(
		<div className='class-item'>
			<div className='row'>
				<div className='col-lg-3'>
					<h1>Algebra</h1>
				</div>
				<div className='col-lg-3'>
					<h2>Dr. Lee</h2>
				</div>
				<div className='col-lg-4'>
					<h3>M T W Th F S S</h3>
				</div>
				<div className='col-lg-2'>
					
				</div>
			</div>
			<button><i class="fas fa-trash"></i></button>
		</div>
	)
}

export default SemesterCreator;