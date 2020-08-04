import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';
import {BackInOut_HandleState, FadeInOut_HandleState} from '../CustomTransition';
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

	addClass(val){
		const semData_copy = this.state.semData;
		semData_copy.classData.push(val);

		this.setState({
			semData: semData_copy,
		})
	}

	render(){
		return(
			<div className='semester-creator-container'>
					<div>
						<h1>{this.state.semData.name} text</h1>
						<hr/>

						<ClassEditor
							style={this.state.semData.classData.length>0 ? classEditorNewPos: null}
							setTime={(key, time) => this.setTime(key, time)} 
							updateCurrent={(key, text) => this.updateCurrent(key, text)}
							time={this.state.currentClass.time}
							addClass={(val) => this.addClass(val)}
						/>

						<SuggestedLinksContainer currentClass={this.state.currentClass}/>
					</div>
			</div>
		);
	}
}

const classEditorNewPos={
    left: 0,
	top: 100,
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
			],
			errors: {
				className: false,
				instructor: false,
				location: false,
				startDate: false,
				endDate: false,
			},
			daysOfWeek_error: false,
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

	addClass(){
		const error = this.checkErrors();
		
		if(!error){
			let daysOfWeek = [];

			this.state.buttons.forEach((x) => {
				daysOfWeek.push(x.selected);
			});

			const returnVal = {
				name: this.className.current.value,
				instructor: this.instructor.current.value,
				location: this.location.current.value,
				daysOfWeek: daysOfWeek,
				date: {
					start: this.startDate.current.value,
					end: this.endDate.current.value,
				},
				time: {
					start: this.props.time.start,
					end: this.props.time.end,
				}
			}
			this.props.addClass(returnVal);
		}
	}

	checkErrors(){
		let error = false;

		//check inputs
		let errors_copy = this.state.errors;
		for(let key in errors_copy){
			if(this[key].current.value.length < 1){
				errors_copy[key] = true;
				error = true;
			}else{
				errors_copy[key] = false;
			}
		}
		
		//check day buttons
		let daysOfWeek_error_copy = this.state.daysOfWeek_error;
		let ct =0;
		this.state.buttons.forEach((x) =>{
			if(x.selected){
				ct++;
			}
		})
		if(ct<1){
			daysOfWeek_error_copy = true;
			error= true;
		}else{
			daysOfWeek_error_copy = false;
		}

		//checkDate
		const startArr = this.startDate.split('/');
		const endArr = this.endDate.split('/');
		const monthToDays ={
			1: 31,
			2: 29,
			3: 31,
			4: 30,
			5: 31,
			6: 30,
			7: 31,
			8: 31,
			9: 30,
			10: 31,
			11: 30,
			12: 31,
		}
		
		if(startArr.length !==3 || endArr.length !== 3){
			//SET ERROR
		}else{
			if(parseInt(startArr[0]) > 0 && parseInt(startArr[0]) < 13){
				const month = parseInt(startArr[0]);
				const day = parseInt(startArr[1]);

				if(day > 0 && day <= monthToDays[month]){
					if(parseInt(startArr[2]) !== Nan){

					}
				}
			}
		}


		this.setState({
			errors: errors_copy,
			daysOfWeek_error: daysOfWeek_error_copy,
		})
		return error;
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
			<div style={this.props.style} className='class-editor'>
				<input 
					ref={this.className} 
					onKeyUp={() => this.props.updateCurrent('name', this.className.current.value)}  
					className='class-name' 
					type="text" 
					placeholder='Class Name'
					style={this.state.errors.className ? {border: '2px solid red', transition: '.3s'} : null}
				/>
				<div className='row instruct-loc'>
					<div className='col-lg-6'>
						<input
							onKeyUp={() => this.props.updateCurrent('instructor', this.instructor.current.value)}
							ref={this.instructor} 
							type="text" 
							placeholder='Instructor'
							style={this.state.errors.instructor ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
					<div className='col-lg-6'>
						<input 
							ref={this.location}
							onKeyUp={() => this.props.updateCurrent('location', this.location.current.value)}
							type="text" 
							placeholder='Location'
							style={this.state.errors.location ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
				</div>

				<div style={this.state.daysOfWeek_error ? {border: '2px solid red', transition: '.3s'} : null} className='day-buttons'>
					{dayButtons}
				</div>

				<div className='row start-end-date'>
					<div className='col-lg-6'>
						<input
							className='datepicker'
							ref={this.startDate} 
							type="text" 
							placeholder='Start Date'
							onKeyUp={() => this.props.updateCurrent('date[start]', this.startDate.current.value)}
							style={this.state.errors.startDate ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
					<div className='col-lg-6'>
						<input 
							className='datepicker'
							ref={this.endDate} 
							type="text" 
							placeholder='End Date'
							onKeyUp={() => this.props.updateCurrent('date[end]', this.endDate.current.value)}
							style={this.state.errors.endDate ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
				</div>

				<StartEndTime 
					time={this.props.time} 
					setTime={(key, time) => this.props.setTime(key, time)}
				/>
				<button onClick={() => this.addClass()} className='add-class'>Add Class</button>
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