import React from 'react';
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
				daysOfWeek: false,
			},
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
        // $(this.startDate).datepicker();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
    	const datepicker = document.getElementById('ui-datepicker-div');
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target) && datepicker && !datepicker.contains(event.target)) {
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
		let error_check = new CE_Errors(this.state.errors, this.props.currentClass);
		console.log(this.state.errors)
		error_check.checkInputs('date');
		error_check.checkDaysOfWeek();
		error_check.checkStartEndDate();


		this.setState({
			errors: error_check.getErrorsObject(),
		})
		return error_check.getError();
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
						<input
							className='datepicker'
							ref={this.startDate} 
							type="text" 
							placeholder='Start Date'
							onKeyUp={() => this.props.updateCurrent_2Key('date', 'start', this.startDate.current.value)}
							style={this.state.errors.date.start ? {border: '2px solid red', transition: '.3s'} : null}
						/>
					</div>
					<div className='col-lg-6'>
						<input 
							className='datepicker'
							ref={this.endDate} 
							type="text" 
							placeholder='End Date'
							onKeyUp={() => this.props.updateCurrent_2Key('date', 'end', this.endDate.current.value)}
							style={this.state.errors.date.end ? {border: '2px solid red', transition: '.3s'} : null}
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

export default ClassEditor;