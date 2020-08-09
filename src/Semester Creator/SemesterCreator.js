import React from 'react';
import StartEndTime from './StartEndTimeComp/StartEndTime';
import {BackInOut_HandleState, FadeInOut_HandleState, FadeInOut, FadeRight_HandleState} from '../CustomTransition';
import SuggestedLinksContainer from './SuggestedLinks/SuggestedLinksContainer';
import {checkDateDif, checkDate} from './helperFunc';
import SevenDayAgenda from './SevenDayAgenda/SevenDayAgenda'

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
						daysOfWeek: [true, false, false, true, false, true, false],
						time: {
							start: '2:00AM',
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
				daysOfWeek: [false, false, false, false, false, false, false],
				time: {
					start: '2:00PM',
					end: '4:00PM',
				},
				date: {
					start: null,
					end: null,
				},
			},
			editMode: false,
			selectedIndex: null,
		}

		this.currentClass_default = {
			name: null,
			instructor: null,
			location: null,
			daysOfWeek: [false, false, false, false, false, false, false],
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

	toggleSelected(i){
		let currentClass_copy = this.state.currentClass;
		currentClass_copy.daysOfWeek[i] = !currentClass_copy.daysOfWeek[i];

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

	addClass(val){
		const semData_copy = this.state.semData;
		semData_copy.classData.push(val);

		this.setState({
			semData: semData_copy,
			currentClass: this.currentClass_default,
		})
	}

	updateClass(){
		const semData_copy = this.state.semData;
		semData_copy.classData[this.state.selectedIndex] = this.state.currentClass;

		this.setState({
			semData: semData_copy,
			currentClass: this.currentClass_default,
			selectedIndex: null,
			editMode: false,
		})
	}

	removeClassItem(i){
		let semData_copy = this.state.semData;
		semData_copy.classData.splice(i, 1);
		
		this.setState({
			semData: semData_copy,
			currentClass: this.currentClass_default
		})
	}

	classItemSelected(i){
		console.log(i);
		const classData_copy = JSON.parse(JSON.stringify(this.state.semData.classData[i])); //makes deep copy

		this.setState({
			editMode: true,
			selectedIndex: i,
			currentClass: classData_copy,
		})
	}

	updateCurrent(key, text){
		console.log(key);
		console.log(text);
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key] = text;

		this.setState({
			currentClass: currentClass_copy,
		});
	}

	updateCurrent_2Key(key1, key2, text){
		const currentClass_copy = this.state.currentClass;
		currentClass_copy[key1][key2] = text;

		this.setState({
			currentClass: currentClass_copy,
		});
	}

	cancelUpdate(){
		this.setState({
			currentClass: this.currentClass_default,
			editMode: false,
			selectedIndex: null,
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
				<BackInOut_HandleState condition={this.state.semData.name === null} >
					<NameSemester semName={(key, text) => this.semName(key, text)}/>
				</BackInOut_HandleState>
				<FadeInOut_HandleState condition={this.state.semData.name !== null}>
					<div>
						<h1>{this.state.semData.name}</h1>
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
											updateCurrent={(key, text) => this.updateCurrent(key, text)}
											updateCurrent_2Key={(key1, key2, text) => this.updateCurrent_2Key(key1, key2, text)}
											currentClass={this.state.currentClass}
											addClass={(val) => this.addClass(val)}
											editMode={this.state.editMode}
											toggleSelected={(i) => this.toggleSelected(i)}
											cancelUpdate={() => this.cancelUpdate()}
											updateClass={() => this.updateClass()}
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
								{this.state.semData.classData.length > 0 ?
									<SevenDayAgenda 
										evItClick={(i) => this.classItemSelected(i)} 
										data={this.state.semData.classData}
										selectedIndex={this.state.selectedIndex}
									/> : null}
							</div>
						</div>
					</div>
				</FadeInOut_HandleState>
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
				name: false,
				instructor: false,
				location: false,
				date: {
					start: false,
					end: false,
				}
			},
			daysOfWeek_error: false,
		}

		this.days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
		
		this.className = React.createRef();
		this.instructor = React.createRef();
		this.location = React.createRef();
		this.startDate = React.createRef();
		this.endDate = React.createRef();

		this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
    	const datepicker = document.getElementById('ui-datepicker-div');
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target) && !datepicker.contains(event.target)) {
            this.cancelUpdate();
        }
    }

	addClass(){
		const error = this.checkErrors();
		
		if(!error){
			const currentClass_copy = this.props.currentClass;
			this.props.addClass(currentClass_copy);

			this.resetInputs();
		}
	}

	updateClass(){
		const error = this.checkErrors();
		
		if(!error){
			const currentClass_copy = this.state.currentClass;
			this.props.updateClass(currentClass_copy);
		}
	}

	resetInputs(){
		this.className.current.value = '';
		this.instructor.current.value = '';
		this.location.current.value = '';
		this.startDate.current.value = '';
		this.endDate.current.value = '';
	}

	checkErrors(){
		let error = false;

		//check inputs
		let errors_copy = this.state.errors;
		for(let key in errors_copy){
			if(this.props.currentClass[key].length < 1){
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
		const startArr = this.props.currentClass.date.start.split('/');
		const endArr = this.props.currentClass.date.end.split('/');

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

	cancelUpdate(){
		this.resetInputs();
		this.props.cancelUpdate();
	}

	render(){
		const dayButtons = this.days.map((data, index) =>
			<DayButton 
				text={data} 
				i={index} 
				key={index} 
				toggleSelected={(i) => this.props.toggleSelected(i)}
				selected={this.props.currentClass.daysOfWeek[index]}
			/>
		)

		if(this.props.editMode){
			this.setInputVals(this.props.currentClass);
		}

		return(
			<div ref={this.wrapperRef} style={this.props.style} className='class-editor'>
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
							onClick={() => this.props.updateCurrent_2Key('date', 'start', this.startDate.current.value)}
							style={this.state.errors.startDate ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
					<div className='col-lg-6'>
						<input 
							className='datepicker'
							ref={this.endDate} 
							type="text" 
							placeholder='End Date'
							onClick={() => this.props.updateCurrent_2Key('date', 'end', this.endDate.current.value)}
							style={this.state.errors.endDate ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
				</div>

				<StartEndTime 
					time={this.props.editMode ? {start: this.props.currentClass.time.start, end: this.props.currentClass.time.end} : this.props.currentClass.time} 
					setTime={(key, time) => this.props.updateCurrent_2Key('time', key, time)}
				/>
				<div className='button-container'>
					<FadeInOut_HandleState condition={!this.props.editMode}>
						<button onClick={() => this.addClass()} className='add-class'>Add Class</button>
					</FadeInOut_HandleState>
					<FadeInOut_HandleState condition={this.props.editMode}>
						<div className='row'>
							<div className='col-lg-6'>
								<button onClick={() => this.cancelUpdate()} className='cancel-update'>Cancel</button>
							</div>
							<div className='col-lg-6'>
								<button onClick={() => this.updateClass()} className='update'>Update</button>
							</div>
						</div>
					</FadeInOut_HandleState>
				</div>
				
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

	componentDidMount(){
		this.input.current.focus();
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