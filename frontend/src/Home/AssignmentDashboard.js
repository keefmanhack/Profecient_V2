import React from 'react';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import moment from 'moment';

import {SuccessCheck} from '../Shared Resources/Effects/lottie/LottieAnimations';
import {FadeInOutHandleState, FadeDownUpHandleState} from '../Shared Resources/Effects/CustomTransition';

import './newAssignment.css';

function AssignmentDashboard(props){
	const assignments = props.assignments ? props.assignments.map((data, index) =>
		<Assignment 
			data={data}
			key={index}
			toggleCompleted={(id, isCompleted) => props.toggleCompleted(id, isCompleted)}
			editAssignment={() => props.editAssignment(index)}
			deleteAssignment={() => props.deleteAssignment(index)}
		/>
	): null;
	
	return(
		<div className='assignment-dashboard sans-font' style={props.style}>
			<h1 className='gray-c '>Upcoming</h1>
			<button onClick={() => this.props.showNewAssForm()} className='add green-bc'>Add</button>
			<hr/>
			<div className='assignments-cont'>
				{assignments}
			</div>
		</div>	
	);
}

class Assignment extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			showDialog: false,
			completed: false,
			mouseOver: false,
		}
	}

	toggleDropDown(){
		const showDialog_copy = this.state.showDialog;

		this.setState({
			showDialog: !showDialog_copy,
		})
	}

	toggleComplete(){
		const completed_copy = this.state.completed;

		this.props.toggleCompleted(this.props.data._id, !completed_copy);

		this.setState({
			completed: !completed_copy,
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
			<div onMouseEnter={() => this.setState({mouseOver: true})} onMouseLeave={() => this.setState({mouseOver: false})} className={'assignment sans-font ' + colorClass}>
				<div className='row'>
					<div className='col-lg-6'>
						<h1>{this.props.data.name}</h1>
					</div>
					<div className='col-lg-4'>
						<h2 className='truncate'>{moment(this.props.data.dueDate).format('dddd')}</h2>
					</div>
					<div className='col-lg-2'>
						<button onClick={() => this.toggleComplete()} className={this.state.completed ? 'light-green-bc completed' : 'completed'}>
							<i class="fas fa-check"></i>
						</button>
					</div>
				</div>
				<FadeDownUpHandleState condition={this.state.showDialog}>
					<div className='more-info'>
						<p>{this.props.data.description}</p>
						<h5>{moment(this.props.data.dueTime).format('h:mm a')}</h5>
						<button onClick={() => this.props.editAssignment()}>Edit</button>
						<button onClick={() => this.props.deleteAssignment()}>Delete</button>
					</div>
				</FadeDownUpHandleState>
				<FadeInOutHandleState condition={this.state.mouseOver}>
					<button className='see-more' onClick={()=> this.toggleDropDown()}>
						{this.state.showDialog ? <i className='fas fa-chevron-up'></i> : <i className='fas fa-chevron-down'></i>}
					</button>
				</FadeInOutHandleState>

				
			</div>
		);
	}
}

class NewAssignment extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			date: this.props.editData ? new Date(this.props.editData.dueDate) : new Date(),
			time: this.props.editData ? new Date(this.props.editData.dueTime) : new Date(),
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
		const editData = this.props.editData
		if(editData){
			this.name.current.value = editData.name;
			this.description.current.value = editData.description;
		}
			
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
				dueTime: new Date(this.state.time),
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
				<FadeInOutHandleState condition={this.props.success}>
	 				<SuccessCheck onCompleted={() =>this.props.hideNewAssForm()}/>
	 			</FadeInOutHandleState>
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
				<button onClick={() => this.submitData()} className='submit blue-bc'>
					{this.props.editData ? 'Update' : 'Submit'}
				</button>
			</div>
		);
	}
}

// function ToDo(props){
// 	return(
// 		<div className='to-do'>
// 			<button>{props.text}</button>
// 		</div>
// 	);
// }


export {NewAssignment};
export default AssignmentDashboard;