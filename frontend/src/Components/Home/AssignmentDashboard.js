import React, {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import moment from 'moment';

import SemesterRequests   from '../../APIRequests/Semester';
import AssignmentRequests from '../../APIRequests/Assignment';

import {SuccessCheck, FailedSent} from '../Shared Resources/Effects/lottie/LottieAnimations';
import {FadeInOutHandleState, FadeDownUpHandleState} from '../Shared Resources/Effects/CustomTransition';
import Loader from '../Shared Resources/Effects/loader';

import './newAssignment.css';

function AssignmentDashboard(props){
	const semReq = new SemesterRequests(props.currentUserID);
	const assReq = new AssignmentRequests(props.currentUserID);

	const [shouldShowNewForm, setShouldShowNewForm]     = useState(false);
	const [currSemester, setCurrSemester]               = useState([]);
	const [upCommingAss, setUpcommingAss]               = useState([]); 
	const [editClassIndex, setEditClassIndex]           = useState(null);
	const [editCount, setEditCount]                     = useState(0);

	useEffect(() => {
		async function fetchData(){
			setUpcommingAss(await assReq.getUpcomming());
		}
		fetchData();

		return () => {}
	}, [shouldShowNewForm, editCount, editClassIndex]);

	useEffect(() => {
		async function fetchData(){
			setCurrSemester(await semReq.getCurrSemWClasses());
		}
		fetchData();

		return () => {}
	}, [shouldShowNewForm, editCount, editClassIndex]);

	const deleteAss = async (classID, assID) => {
		const res = await assReq.delete(classID, assID); 
		let ct = editCount;
		setEditCount(++ct);
		if(!res.success){
			alert('Unable to delete assignment');
		}
	}


	const assignments = upCommingAss ? upCommingAss.map((data, index) =>
		<Assignment 
			data={data.ass}
			key={data.ass._id}
			toggleCompleted={(id, isCompleted) => assReq.toggleCompleted(id, {complete: isCompleted})}
			editAssignment={() => {setEditClassIndex(index);}}
			deleteAssignment={() => deleteAss(data.parentClassID, data.ass._id)}
		/>
	): null;
	
	const handleNewEvent = () => {
		if(currSemester){
			setShouldShowNewForm(true);
		}else{
			alert('You need to create a semester to add an assignment');
		}
	}

	return(
		<React.Fragment>
			<div className='assignment-dashboard sans-font' style={props.style}>
				<h1 className='gray-c '>Upcoming</h1>
				<button onClick={() => handleNewEvent(true)} className='add green-bc'>Add</button>
				<hr/>
				<div className='assignments-cont'>
					{assignments}
				</div>
			</div>
			<FadeInOutHandleState condition={shouldShowNewForm || editClassIndex !==null}>
				<NewAssignment 
					hideForm={() => {setShouldShowNewForm(false); setEditClassIndex(null)}}
					classes={currSemester.classes}
					currentUserID={props.currentUserID}
					editData={editClassIndex !==null ? upCommingAss[editClassIndex] : null}
				/>
			</FadeInOutHandleState>
		</React.Fragment>
	);
}

class Assignment extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			showDialog: false,
			completed: false,
			mouseOver: false,
			deleting: false,
		}

		this.timeOut = null;
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

	deleteItem(){
		this.setState({deleting: true});
		this.timeOut = setTimeout(function(){
			this.setState({deleting: false});
		}.bind(this), 3000);
		this.props.deleteAssignment();
	}

	componentWillUnmount(){
		clearTimeout(this.timeOut);
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
				{this.state.deleting ? <Loader/>: null}
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
						<button onClick={() => this.deleteItem()}>Delete</button>
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
			date: this.props.editData ? new Date(this.props.editData.ass.dueDate) : new Date(),
			time: this.props.editData ? new Date(this.props.editData.ass.dueTime) : new Date(),
			errors: {
				name: false,
				classPicked: false,
				dueDate: false,
			},
			selectedClassID: this.props.editData ? this.props.editData.parentClassID : null,
			success: false,
			error: false,
		}

		this.assReq = new AssignmentRequests(this.props.currentUserID);

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.name = React.createRef();
		this.description = React.createRef();
	}

	componentDidMount() {
		const editData = this.props.editData
		if(editData){
			this.name.current.value = editData.ass.name;
			this.description.current.value = editData.ass.description;
		}
			
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hideForm();
        }
    }

	checkErrors(){
		let error_copy = this.state.errors;

		if(this.name.current.value === ''){
			error_copy.name = true;
		}else{
			error_copy.name = false;
		}

		if(this.state.selectedClassID === null){
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

	async submitData(){
		if(!this.checkErrors()){
			const data = {
				name: this.name.current.value,
				dueDate: new Date(this.state.date),
				dueTime: new Date(this.state.time),
				description: this.description.current.value,
			}
			const editData = this.props.editData;
			let res = editData ? await this.assReq.update(editData.parentClassID, editData.ass._id, this.state.selectedClassID, data) 
				: await this.assReq.create(this.state.selectedClassID, data);
			res.success ? this.setState({success: true}) : this.setState({error: true});
		}
	}

	render(){
		const classes = this.props.classes.map((o, index) =>
			<div key={index} className='col-lg-3'>
		       <button 
		       		className={this.state.selectedClassID===o._id ? 'class green-bc' : 'class off-blue-bc'} 
		       		onClick={() => this.setState({selectedClassID: o._id})} 
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
			<React.Fragment>
				<div className='background-shader'/>
				<div ref={this.wrapperRef} className='new-assignment new-form sans-font'>
					<FadeInOutHandleState condition={this.state.success}>
		 				<SuccessCheck onCompleted={() =>this.props.hideForm()}/>
		 			</FadeInOutHandleState>
		 			<FadeInOutHandleState condition={this.state.error}>
		 				<FailedSent onCompleted={() =>this.props.hideForm()}/>
		 			</FadeInOutHandleState>
					<button onClick={()=> this.props.hideForm()} id='X'>Cancel</button>
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
					        	onChange={(date) => this.setState({date: date})}
					        	style={this.state.errors.dueDate ? {border: '1px solid red'} : null}
					      	/>
						</div>
						<div className='col'>
							<TimePicker
					          onChange={(time) => this.setState({time: time})}
					          clockIcon={null}
					          disableClock={true}
					          value={this.state.time}
					        />
						</div>
					</div>
					<div className='col textarea-col'>
						<textarea ref={this.description} placeholder='Description'></textarea>
					</div>
					<button onClick={() => this.submitData()} className={this.props.editData ? 'submit orange-bc' : 'submit blue-bc'}>
						{this.props.editData ? 'Update' : 'Submit'}
					</button>
				</div>
			</React.Fragment>
		);
	}
}



export {NewAssignment};
export default AssignmentDashboard;