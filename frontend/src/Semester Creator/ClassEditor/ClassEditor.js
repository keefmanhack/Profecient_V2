import React from 'react';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";

import {FadeInOut_HandleState} from '../../CustomTransition';
import StartEndTime from '../StartEndTimeComp/StartEndTime';
import CE_Errors from './helperFunc';
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
				},
				time: {
					start: false,
					end: false,
				},
				daysOfWeek: false,
			},
		}

		this.days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
		
		this.className = React.createRef();
		this.instructor = React.createRef();
		this.location = React.createRef();

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
		if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
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
	}

	checkErrors(){
		let errors = this.state.errors;

		if(this.className.current.value === ''){
			errors.name = true;
		}else{
			errors.name =false;
		}

		if(this.instructor.current.value === ''){
			errors.instructor = true;
		}else{
			errors.instructor =false;
		}

		if(this.location.current.value === ''){
			errors.location = true;
		}else{
			errors.location =false;
		}

		const time = this.props.currentClass.time;

		if(!moment(time.start).isValid()){
			errors.time.start = true;
		}else{
			errors.time.start = false;
			if(!moment(time.end).isValid()){
				errors.time.end = true;
			}else{
				errors.time.end = false;

				if(moment(time.start).isAfter(time.end)){
					errors.time.end = true;
				}else{
					errors.time.end = false;
				}
			}
		}

		const date = this.props.currentClass.date;

		if(!moment(date.start).isValid()){
			errors.date.start = true;
		}else{
			errors.date.start = false;
			if(!moment(date.end).isValid()){
				errors.date.end = true;
			}else{
				errors.date.end = false;

				if(moment(date.start).isAfter(date.end)){
					errors.date.end = true;
				}else{
					errors.date.end = false;
				}
			}
		}

		let ct = 0;
		this.props.currentClass.daysOfWeek.forEach(function(day){
			if(day){
				ct++
			};
		})

		if(ct>0){
			errors.daysOfWeek = false;
		}else{
			errors.daysOfWeek = true;
		}

		this.setState({
			errors: errors,
		})

		if(errors.name || errors.location || errors.instructor || errors.daysOfWeek || errors.time.start || errors.time.end || errors.date.start || errors.date.end){
			return true;
		}
		return false;
	}

	setInputVals(val){
		this.className.current.value = val.name;
		this.instructor.current.value = val.instructor;
		this.location.current.value = val.location;
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
					style={this.state.errors.name ? {border: '2px solid red', transition: '.3s'} : null}
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

				<div style={this.state.errors.daysOfWeek ? {border: '2px solid red', transition: '.3s'} : null} className='day-buttons'>
					{dayButtons}
				</div>

				<div className='row start-end-date'>
					<div className='col-lg-6'>
						<div style={this.state.errors.date.start ? {border: '2px solid red', borderRadius: '5px', transition: '.3s'} : null}>
							<DatePicker
					        	selected={this.props.currentClass.date.start}
					        	onChange={(date) => this.props.updateCurrent_2Key('date', 'start', date)}
					        	selectsStart
					        	startDate={new Date(this.props.currentClass.time.start)}
					        	endDate={new Date(this.props.currentClass.time.end)}
					        	
					      	/>
				      	</div>
					</div>
					<div className='col-lg-6'>
						<div style={this.state.errors.date.end ? {border: '2px solid red', borderRadius: '5px', transition: '.3s'} : null}>
								<DatePicker
					        	selected={this.props.currentClass.date.end}
					        	onChange={(date) => this.props.updateCurrent_2Key('date', 'end', date)}
					        	selectsEnd
					        	startDate={new Date(this.props.currentClass.time.start)}
					        	endDate={new Date(this.props.currentClass.time.end)}
					        	style={this.state.errors.date.end ? {border: '2px solid red', transition: '.3s'} : null}
					      	/>
						</div>
					</div>
				</div>

				<div className='row start-end-date'>
					<div className='col-lg-6'>
						<div style={this.state.errors.time.start ? {border: '2px solid red', borderRadius: '5px', transition: '.3s'} : null} >
							<TimePicker
					          onChange={(time) => this.props.updateCurrent_2Key('time', 'start', time)}
					          clockIcon={null}
					          disableClock={true}
					          clearIcon={null}
					          value={this.props.currentClass.time.start}
					        />
						</div>
					</div>
					<div className='col-lg-6'>
						<div style={this.state.errors.time.end ? {border: '2px solid red', borderRadius: '5px', transition: '.3s'} : null}>
							<TimePicker
					          onChange={(time) => this.props.updateCurrent_2Key('time', 'end', time)}
					          clockIcon={null}
					          clearIcon={null}
					          disableClock={true}
					          value={this.props.currentClass.time.end}
					        />
						</div>
					</div>
				</div>

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

export default ClassEditor;