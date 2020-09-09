import React from 'react';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import moment from 'moment';

import {SuccessCheck} from './lottie/LottieAnimations';
import {dateObjToStdTime, convertToStandard} from './Agenda_Helper';
import {FadeInOut_HandleState, FadeDownUp_HandleState} from './CustomTransition';

class AssignmentDashboard extends React.Component{
	constructor(props){
		super(props);
	}

	

	render(){
		const assignments = this.props.assignments ? this.props.assignments.map((data, index) =>
				<Assignment 
					data={data}
					key={index}
				/>
		): null;
		return(
			<div className='assignment-dashboard sans-font' style={this.props.style}>
				<h1 className='gray-c '>Upcomming</h1>
				<button onClick={() => this.props.showNewAssForm()} className='add green-bc'>Add</button>
				<hr/>
				<div className='assignments-cont'>
					{assignments}
				</div>
			</div>	
		);
	}
}

class Assignment extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			showDialog: false,
		}
	}

	toggleDropDown(){
		const showDialog_copy = this.state.showDialog;

		this.setState({
			showDialog: !showDialog_copy,
		})
	}

	render(){
		let colorClass = 'muted-green-bc';

		if(moment().add(1, 'days') >= moment(this.props.data.dueDate)){
			colorClass = 'muted-red-bc';
		}else if(moment().add(3, 'days') >= moment(this.props.data.dueDate)){
			colorClass = 'muted-orange-bc';
		}

		return(
			<div className={'assignment sans-font ' + colorClass}>
				<div className='row'>
					<div className='col-lg-6'>
						<h1>{this.props.data.name}</h1>
					</div>
					<div className='col-lg-4'>
						<h2 className='truncate'>{moment(this.props.data.dueDate).format('dddd')}</h2>
					</div>
					<div className='col-lg-2'>
						<button onClick={()=> this.toggleDropDown()}>...</button>
					</div>
				</div>
				<FadeDownUp_HandleState condition={this.state.showDialog}>
					<div className='more-info'>
						<p>{this.props.data.description}</p>
						<h5>Due by: {this.props.data.dueTime}</h5>
						<button>Completed</button>
						<button>Edit</button>
						<button>Delete</button>

						
					</div>
				</FadeDownUp_HandleState>
				
			</div>
		);
	}
}

class NewAssignment extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			date: new Date(),
			time: new Date(),
			errors: {
				name: false,
				classPicked: false,
				dueDate: false,
			}
		}

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.name = React.createRef();
		this.description = React.createRef();
	}

	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target) && !this.dueTime.current.contains(event.target)) {
            this.props.hideNewAssForm();
        }
    }

    dateChanged(date){
		this.setState({
			date: date,
		})
	}

	timeChanged(time){
		this.setState({
			time: time,
		})
	}

	checkErrors(){
		let error_copy = this.state.errors;

		if(this.name.current.value === ''){
			error_copy.name = true;
		}else{
			error_copy.name = false;
		}

		if(this.props.selectedIndex === null){
			error_copy.classPicked = true;
		}else{
			error_copy.classPicked = false;
		}

		if(this.state.dueDate === null){
			error_copy.dueDate = true;
		}else{
			error_copy.dueDate = false;
		}

		this.setState({
			errors: error_copy,
		})

		if(error_copy.dueDate || error_copy.classPicked || error_copy.name){
			return true;
		}else{
			return false;
		}

	}

	submitData(){
		if(!this.checkErrors()){
			const data = {
				name: this.name.current.value,
				dueDate: new Date(this.state.date),
				dueTime: timePickerFormToStd(this.state.time),
				description: this.description.current.value,
			}

			this.props.sendData(data);
		}
	}

	render(){
		const classes = this.props.classes.map((o, index) =>
			<div key={index} className='col-lg-3'>
		       <button 
		       		className={this.props.selectedIndex===index ? 'class green-bc' : 'class off-blue-bc'} 
		       		onClick={() => this.props.handleClassClick(index)} 
		       		key={index}
		       		style={this.state.errors.classPicked ? {border: '1px solid red'} : null}
		       	>
	       			<h5 
	       				className='truncate'
	       			>{o.name}
	       			</h5>
		       	</button>
		    </div>
		)

		return(
			<div ref={this.wrapperRef} className='new-assignment new-form sans-font'>
				<FadeInOut_HandleState condition={this.props.success}>
	 				<SuccessCheck onCompleted={() =>this.props.hideNewAssForm()}/>
	 			</FadeInOut_HandleState>
				<button onClick={()=> this.props.hideNewAssForm()} id='X'>Cancel</button>
				<div 
					className='row'
				>
					{classes}
				</div>

				<div className='row'>
					<div className='col'>
						<input 
							style={this.state.errors.name ? {border: '1px solid red'} : null}
							ref={this.name} 
							placeholder='Assignment Name' 
							className='name' 
							type='text' 
						/>
					</div>
				</div>

				<div className='row'>
					<div className='col'>
						<DatePicker
				        	selected={this.state.date}
				        	onChange={(date) => this.dateChanged(date)}
				        	style={this.state.errors.dueDate ? {border: '1px solid red'} : null}
				      	/>
					</div>
					<div className='col'>
						<TimePicker
				          onChange={(time) => this.timeChanged(time)}
				          clockIcon={null}
				          disableClock={true}
				          value={this.state.time}
				        />
					</div>
				</div>
				<div className='col textarea-col'>
					<textarea ref={this.description} placeholder='Description'></textarea>
				</div>
				<button onClick={() => this.submitData()} className='submit blue-bc'>Submit</button>
			</div>
		);
	}
}

class ToDo extends React.Component{
	render(){
		return(
			<div className='to-do'>
				<button>{this.props.text}</button>
			</div>
		);
	}
}

function timePickerFormToStd(date){
	const dateStr = date + '';
	const removedColon = dateStr.substring(0, dateStr.length-3) + dateStr.substring(dateStr.length-2, dateStr.length);

	return convertToStandard(removedColon)

}

export {NewAssignment};
export default AssignmentDashboard;