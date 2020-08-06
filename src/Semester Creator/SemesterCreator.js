import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';
import {BackInOut_HandleState, FadeInOut_HandleState, FadeRight_HandleState} from '../CustomTransition';
import SuggestedLinksContainer from './SuggestedLinks/SuggestedLinksContainer';
import {checkDateDif, checkDate} from './helperFunc';

class SemesterCreator extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			semData: {
				name: null,
				classData: [
					{
						name: 'Algebra 1',
						instructor: 'l',
						location: 'g',
						daysOfWeek: [false, true, false, true, false, true, false],
						time: {
							start: '2:00PM',
							end: '4:00PM',
						},
						date: {
							start: '10/12/2020',
							end: '10/12/2021',
						}
					},
					{
						name: 'b',
						instructor: 'l',
						location: 'g',
						daysOfWeek: [false, true, false, true, false, true, false],
						time: {
							start: '2:00PM',
							end: '4:00PM',
						},
						date: {
							start: '10/12/2020',
							end: '10/12/2021',
						}
					},
					{
						name: 'c',
						instructor: 'l',
						location: 'g',
						daysOfWeek: [false, true, false, true, false, true, false],
						time: {
							start: '2:00PM',
							end: '4:00PM',
						},
						date: {
							start: '10/12/2020',
							end: '10/12/2021',
						}
					},
				],
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
			},
			editMode: false,
			selectedIndex: null,
		}

		this.currentClass_default = {
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
			currentClass: this.currentClass_default,
		})
	}

	removeClassItem(i){
		let semData_copy = this.state.semData;
		semData_copy.classData.splice(i, 1);
		
		this.setState({
			semData: semData_copy,
		})
		console.log(this.state.semData)
	}

	classItemSelected(i){
		const classData_copy = this.state.semData.classData[i]

		this.setState({
			editMode: true,
			selectedIndex: i,
			currentClass: classData_copy,
		})
	}

	render(){
		const classItems = this.state.semData.classData.map((data, index) =>
			<ClassItem 
				key={index}
				i={index} 
				itemSelected={(i) => this.classItemSelected(i)} 
				removeClassItem={(i) => this.removeClassItem(i)} 
				data={data}
				selected={index === this.state.selectedIndex ? true: false}
			/>
		);
		return(
			<div className='semester-creator-container'>
				<div>
					<h1>{this.state.semData.name} text</h1>
					<hr/>
				<div className='row'>
					<div className='col-lg-6'>
						<FadeInOut_HandleState condition={this.state.semData.classData.length>0}>
							<div className='class-item-container'>
								{classItems}
							</div>
						</FadeInOut_HandleState>

						<div className='row'>
							<div className='col-lg-6'>
								<ClassEditor
									setTime={(key, time) => this.setTime(key, time)} 
									updateCurrent={(key, text) => this.updateCurrent(key, text)}
									currentClass={this.state.currentClass}
									addClass={(val) => this.addClass(val)}
									editMode={this.state.editMode}
								/>
							</div>
							<div className='col-lg-6'>
								<SuggestedLinksContainer 
									currentClass={this.state.currentClass}
									
								/>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						
					</div>
				</div>
					

					

					
				</div>
			</div>
		);
	}
}

// const classEditorNewPos={
//     left: 0,
// 	top: 100,
// 	transition: '.3s',
// }

// const suggLinksNewPos={
// 	left: 10,
//     top: 61,
//     transition: '.3s',
// }

class ClassEditor extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			errors: {
				className: false,
				instructor: false,
				location: false,
				startDate: false,
				endDate: false,
			},
			daysOfWeek_error: false,
		}

		this.days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


		
		this.className = React.createRef();
		this.instructor = React.createRef();
		this.location = React.createRef();
		this.startDate = React.createRef();
		this.endDate = React.createRef();
	}

	addClass(){
		const error = this.checkErrors();
		
		if(!error){
			let daysOfWeek = [];
			let buttons_Copy = this.state.buttons;

			const returnVal = {
				name: this.className.current.value,
				instructor: this.instructor.current.value,
				location: this.location.current.value,
				daysOfWeek: this.props.currentClass.daysOfWeek,
				date: {
					start: this.startDate.current.value,
					end: this.endDate.current.value,
				},
				time: {
					start: this.props.currentClass.time.start,
					end: this.props.currentClass.time.end,
				}
			}
			this.props.addClass(returnVal);

			this.resetInputs();
			this.setState({
				buttons: buttons_Copy,
			})
		}
	}

	resetInputs(){
		this.className.current.value = '';
		this.instructor.current.value = '';
		this.location.current.value = '';
		this.startDate.current.value = '';
		this.endDate.current.value = '';
	}

	toggleSelected(i){
		let daysOfWeek_copy = this.props.currentClass.daysOfWeek;
		daysOfWeek_copy[i] = !daysOfWeek_copy[i];

		this.props.updateCurrent('daysOfWeek', daysOfWeek_copy);
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
		this.props.currentClass.daysOfWeek.forEach((x) =>{
			if(x){
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
		const startArr = this.startDate.current.value.split('/');
		const endArr = this.endDate.current.value.split('/');

		if(checkDate(startArr)){
			if(checkDate(endArr)){
				if(!checkDateDif(startArr, endArr)){
					errors_copy.endDate = true;
					error=true;
				}
			}else{
				errors_copy.endDate = true;
				error=true;
			}
		}else{
			errors_copy.startDate = true;
			error=true;
		}


		this.setState({
			errors: errors_copy,
			daysOfWeek_error: daysOfWeek_error_copy,
		})
		return error;
	}

	setInputVals(val){
		this.className.current.value = val.name;
		this.instructor.current.value = val.instructor;
		this.location.current.value = val.location;
		this.startDate.current.value = val.date.start;
		this.endDate.current.value = val.date.end;
	}

	render(){
		const dayButtons = this.days.map((data, index) =>
			<DayButton 
				text={data} 
				i={index} 
				key={index} 
				toggleSelected={(i) => this.toggleSelected(i)}
				selected={this.props.currentClass.daysOfWeek[index]}
			/>
		)

		if(this.props.editMode){
			this.setInputVals(this.props.currentClass);
		}

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
					time={this.props.editMode ? {start: this.props.currentClass.time.start, end: this.props.currentClass.time.end} : this.props.currentClass.time} 
					setTime={(key, time) => this.props.setTime(key, time)}
				/>
				<FadeInOut_HandleState condition={!this.props.editMode}>
					<button onClick={() => this.addClass()} className='add-class'>Add Class</button>
				</FadeInOut_HandleState>
				<FadeInOut_HandleState condition={this.props.editMode}>
					<button onClick={() => this.addClass()} className='add-class'>Update Class</button>
				</FadeInOut_HandleState>
				
			</div>
		);
	}
}

function DayButton(props){
	return(
		<button 
			onClick={(i) => props.toggleSelected(props.i)}
			className={props.selected ? 'selected' : null}
		>{props.text}
		</button>
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

class ClassItem extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			mouseOver: false
		}

		this.days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	}

	toggleMouseOver(isMouseOver){
		this.setState({
			mouseOver: isMouseOver,
		})
	}
	
	
	render(){
		const daySpans = this.days.map((day, index)=>
			<span style={this.props.data.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);
		return(
			<div
				style={this.props.selected ? {border: '2px solid #4F9AF1', transition: '.3s'} : null}
				onClick={() => this.props.itemSelected(this.props.i)}
				onMouseEnter={() => this.toggleMouseOver(true)} 
				onMouseLeave={() => this.toggleMouseOver(false)} 
				className='class-item'
			>
				<div className='row'>
					<div className='col-lg-3'>
						<h1>{this.props.data.name}</h1>
					</div>
					<div className='col-lg-3'>
						<h2>{this.props.data.instructor}</h2>
					</div>
					<div className='col-lg-4'>
						<h3>{daySpans}</h3>
					</div>
					<div className='col-lg-2'>
						
					</div>
				</div>
				<FadeRight_HandleState condition={this.state.mouseOver}>
					<button onClick={() => this.props.removeClassItem(this.props.i)}><i class="fas fa-trash"></i></button>
				</FadeRight_HandleState>
			</div>
		)
	}
}

export default SemesterCreator;