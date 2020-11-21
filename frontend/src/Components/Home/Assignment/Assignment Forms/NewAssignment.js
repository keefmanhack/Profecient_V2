import React, { useEffect } from 'react';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';

//API Requests
import AssignmentRequests from '../../../../APIRequests/Assignment';
import ClassRequests from '../../../../APIRequests/Class';

//Effects
import {FadeDownUpHandleState, FadeInOutHandleState} from '../../../Shared Resources/Effects/CustomTransition';
import {SuccessCheck, FailedSent} from '../../../Shared Resources/Effects/lottie/LottieAnimations';
import Loader from '../../../Shared Resources/Effects/Loader/loader';

//Messages
import MessageFlasher from '../../../Shared Resources/MessageFlasher';
import AbsractError from '../../../Shared Resources/Messages/Error Messages/AbsractError';

import './index.css';
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
			},
			classes: null,
			selectedID: null,
			errMsg: '',
			success: false,
			error: false,
			loading: false,
		}

		this.assReq = new AssignmentRequests(this.props.currentUserID);
		this.classReq = new ClassRequests(this.props.currentUserID);

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.name = React.createRef();
		this.description = React.createRef();
	}

	componentDidMount() {
		this.getClasses();
        document.addEventListener('mousedown', this.handleClickOutside);
	}
	
	async getClasses(){
		const res = await this.classReq.getCurrent();
		if(res.success){
			if(res.classes.length===0){
				this.setState({errMsg: 'You need classes to add an assignment'});
				setTimeout(() => {
					this.props.hideForm();
				}, 2000);
			}else{
				this.setState({classes: res.classes});
			}
		}else{
			this.setState({errMsg: res.error});
			setTimeout(() => {
				this.props.hideForm();
			}, 2000);
		}
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

		if(this.state.selectedID === null){
			this.setState({errMsg: "You need to choose a class to add an assignment"});
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
			this.setState({loading: true});
			const data = {
				name: this.name.current.value,
				dueDate: new Date(this.state.date),
				dueTime: new Date(this.state.time),
				description: this.description.current.value,
			}
			let res =  await this.assReq.create(this.state.selectedID, data);
			this.setState({loading: false});
			res.success ? this.setState({success: true}) : this.setState({error: res.error});
		}
	}

	render(){
		return(
			<React.Fragment>
				<MessageFlasher 
					condition={this.state.errMsg!==''} 
					resetter={() => this.setState({errMsg: ''})}
					animation={FadeDownUpHandleState}
					timeOut={3000}
				>
					<AbsractError errorMessage={this.state.errMsg}/>
				</MessageFlasher>
				<div className='background-shader'/>
				<div ref={this.wrapperRef} className='new-assignment new-form sans-font'>
					{this.state.loading ? <Loader/> : null}
					<FadeInOutHandleState condition={this.state.success}>
		 				<SuccessCheck onCompleted={() =>this.props.hideForm()}/>
		 			</FadeInOutHandleState>
		 			<FadeInOutHandleState condition={this.state.error}>
		 				<FailedSent onCompleted={() =>this.props.hideForm()}/>
		 			</FadeInOutHandleState>
					<button onClick={()=> this.props.hideForm()} id='X'>Cancel</button>
					<ClassSelector 
						classes={this.state.classes} 
						selectedID={this.state.selectedID} 
						setSelectedID={(id) => this.setState({selectedID: id})}
					/>

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
					<button onClick={() => this.submitData()} className='submit blue-bc'>
						Submit
					</button>
				</div>
			</React.Fragment>
		);
	}
}

function ClassSelector(props){
	if(!props.classes){return <div className='class-selector'><Loader/></div>}
	const classes = props.classes.map(data => 
		<ClassBtn 
			name={data.name} 
			setSelected={() => props.setSelectedID(data._id)} 
			key={data._id}
			isSelected={data._id === props.selectedID}
		/>
	)
	return(
		<div className='class-selector row'>
			{classes}
		</div>
	)
}

function ClassBtn(props){
	return(
		<div className='col-lg-3'>
			<button 
				className={props.isSelected ? 'class green-bc' : 'class off-blue-bc'} 
				onClick={() => props.setSelected()} 
			>
				<h5 
					className='truncate'
				>{props.name}
				</h5>
			</button>
	 	</div>
	)
}

export default NewAssignment;