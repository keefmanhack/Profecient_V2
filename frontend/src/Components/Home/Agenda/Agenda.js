import React from 'react';
import TimePicker from 'react-time-picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

import {SuccessCheck} from '../../Shared Resources/Effects/lottie/LottieAnimations';
import {findTopPosition, dateObjToStdTime, convertToStdDate} from './Agenda_Helper';
import {FadeInOutHandleState} from '../../Shared Resources/Effects/CustomTransition';
import Loader from '../../Shared Resources/Effects/loader';

import AgendaRequests from '../../../APIRequests/Agenda';

import './newAgItem.css';
import './agenda.css';

class Agenda extends React.Component{
	constructor(props){
		super(props);

		this.agendaReq = new AgendaRequests(this.props.currentUserID);

		this.state ={
			items: null,
			showNewForm: false,
			selectedItemIndex: -1,
		}
		
		this.times = ['12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM', '4:00AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM', '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM', '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM' ]
		
		this.scrollBox = React.createRef();
	}

	componentDidMount(){
		const date = new Date();
		const currTime = dateObjToStdTime(date);

		this.scrollBox.current.scrollTop=findTopPosition(currTime);
		this.getCurrentItems();
	}

	async getCurrentItems(){
		this.setState({items: await this.agendaReq.getTodaysEvents()});
	}

	reset(){
		this.getCurrentItems();
		this.setState({
			showNewForm: false,
			selectedItemIndex: -1
		})
	}
	
	render(){
		const timeHRs = this.times.map((time, index) =>
			<TimeHR time={time} spacing={index*25} key={index}/>
		);

		const AgendaItems = this.state.items ? this.state.items.map((data, index) => {
			const startTime = moment(data.time.start);
			const endTime = moment(data.time.end);

			const topDis = startTime.diff(moment().startOf('Day'), 'minutes') /30.0 * 25;
			const height = endTime.diff(startTime, 'minutes') /30.0 * 25;
			return <AgendaItem 
				key={index}
				height={height >10 ? height: 10} 
				top={topDis} 
				name={data.name} 
				location={data.location}
				zIndex={index}
				itemClicked={() => this.setState({selectedItemIndex: index})}
			/>
		}) : null;

		//NEED TO ADD UPCOMMING NEXT PART TO SHOW DATE-TIME INFO
		return(
			<div className='agenda sans-font' style={{position: 'relative'}}>
				<FadeInOutHandleState condition={this.state.showNewForm || this.state.selectedItemIndex>=0}>
					<NewAgendaItem 
						updateItem={this.state.selectedItemIndex>=0 ? this.state.items[this.state.selectedItemIndex] : null} 
						agendaReq={this.agendaReq} 
						hideNewAgForm={() => {this.reset()}}
					/>
				</FadeInOutHandleState>
				<h1 className='gray-c'>Agenda</h1>
				<h4 className='gray-c'>{convertToStdDate(new Date())}</h4>
				<button className='see-more gray-c'>See More</button>
				<button onClick={() => this.setState({showNewForm: true})} className='add green-bc'>Add</button>
				<div ref={this.scrollBox} className='foreground'>
					{timeHRs}
					{this.state.items ? AgendaItems : <Loader/>}
				</div>
			</div>
		);
	}

}


class AgendaItem extends React.Component{
	render(){
		return(
			<div 
				onClick={() => this.props.itemClicked()}
				style={{height: this.props.height, top: this.props.top, zIndex: this.props.zIndex}} 
				className={this.props.isClass ? 'blue-bc item-container' : 'light-green-bc item-container'}
			>
				<h2>{this.props.name}</h2>
				<h3>{this.props.location}</h3>
			</div>
		);
	}
}

function TimeHR(props){

	const hrStyle= !props.time.includes('3') ? {borderTopWidth: 2} : null;

	return(
		<div style={{top: props.spacing}} className='time-hr'>
			<hr style={hrStyle}/>
			<h5>{props.time}</h5>
		</div>
	);
}

class NewAgendaItem extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			time:{
				start: this.props.updateItem ? new Date(this.props.updateItem.time.start) : new Date(moment()),
				end: this.props.updateItem ? new Date(this.props.updateItem.time.end) : new Date(moment().add(1, 'hours')),
			},
			date: this.props.updateItem ? new Date(this.props.updateItem.date) : new Date(),
			errors: {
				name: false,
				time: {
					start: false,
					end: false,
				}
			},
			success: false,
		}

		this.wrapperRef = React.createRef();
		this.name = React.createRef();
		this.location = React.createRef();
		this.description = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);

        if(this.props.updateItem){
        	const updateItem = this.props.updateItem;

        	this.name.current.value = updateItem.name;
        	this.location.current.value = updateItem.location;
        	this.description.current.value = updateItem.description;
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }


	// Server interaction
	async submitForm(){
		const error = this.checkErrors();

		if(!error){
			const data = {
				name: this.name.current.value,
				location: this.location.current.value,
				description: this.description.current.value,
				time: this.state.time,
				date: this.state.date,
			}
			await this.props.agendaReq.postNewItem(data);
			this.setState({success: true})
		}
	}

	async update(){
		if(!this.checkErrors()){
			const data = {
				name: this.name.current.value,
				location: this.location.current.value,
				description: this.description.current.value,
				time: this.state.time,
				date: this.state.date,
			}
			await this.props.agendaReq.updateItem(this.props.updateItem._id, data);
			this.setState({success: true})
		}
	}

	async delete(){
		await this.props.agendaReq.deleteItem(this.props.updateItem._id);
		this.setState({success: true});
	}

	checkErrors(){
		let errors = this.state.errors;

		if(this.name.current.value === ''){
			errors.name = true;
		}else{
			errors.name = false;
		}

		const startTime = moment(new Date(this.state.time.start));
		const endTime = moment(new Date(this.state.time.end));
		if(!startTime.isValid()){
			errors.time.start = true;
		}else{
			errors.time.start = false;
			if(!endTime.isValid()){
				errors.time.end = true;
			}else{
				errors.time.end = false;

				if(startTime.isAfter(endTime)){
					errors.time.end = true;
				}else{
					errors.time.end = false;
				}
			}
		}



		this.setState({
			errors: errors,
		})


		if(errors.name || errors.time.start || errors.time.end){
			return true;
		}else{
			return false;
		}
	}

	dateChanged(date){
		this.setState({
			date: date
		})
	}

	timeChanged(startOrEnd, newTime){
		let time =  this.state.time;
		time[startOrEnd] = newTime;
		this.setState({
			time: time,
		})
	}
	// End Of Server Interaction

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hideNewAgForm();
        }
    }

    render(){
    	return(
    		<React.Fragment>
	    		<div className='background-shader'/>
	    		<div ref={this.wrapperRef} className='new-ag-it-cont sans-font form-bc new-form'>
	    			
	    			<FadeInOutHandleState condition={this.state.success}>
		 				<SuccessCheck onCompleted={() =>this.props.hideNewAgForm()}/>
		 			</FadeInOutHandleState>
	    			<button onClick={() => this.props.hideNewAgForm()} className='cancel'>Cancel</button>
	    			<input
	    				style={this.state.errors.name ? {border: '1px solid red'} : null}
	    				ref={this.name} 
	    				type="text" 
	    				className='name' 
	    				placeholder='Event Name'
	    			/>
	    			<input ref={this.location} type="text" placeholder='Location'/>
	    			<div className='row'>
	    				<div className='col-lg-6'>
	    					<div style={this.state.errors.time.start ? {border: '2px solid red', borderRadius: '5px', transition: '.3s'} : null} >
		    					<label  htmlFor="">Start</label>
		    					<TimePicker
							          onChange={(time) => this.timeChanged('start', moment(time, 'hh:mm'))}
							          clockIcon={null}
							          disableClock={true}
							          format={'hh:mm a'}
							          clearIcon={null}
							          value={new Date(this.state.time.start)}
							    />
							</div>
							<div style={this.state.errors.time.end ? {border: '2px solid red', borderRadius: '5px', transition: '.3s'} : null} >
		    					<label htmlFor="">End</label>
		    					<TimePicker
							          onChange={(time) => this.timeChanged('end', moment(time, 'hh:mm'))}
							          clockIcon={null}
							          disableClock={true}
							          format={'hh:mm a'}
							          clearIcon={null}
							          value={new Date(this.state.time.end)}
							    />
							</div>
	    				</div>
	    				<div className='col-lg-6'>
		    				<DatePicker
					        	selected={this.state.date}
					        	onChange={(date) => this.dateChanged(date)}
					      	/>
	    					<textarea ref={this.description} placeholder='Description'></textarea>
	    				</div>
	    			</div>
	    			{this.props.updateItem ===null ? 
	    				<button onClick={() => this.submitForm()} className='blue-bc submit'>Submit</button>
	    			:
	    				<div className='row'>
	    					<div className='col-lg-6'>
	    						<button onClick={() => this.delete()} className='red-bc delete'>Delete</button>
	    					</div>
	    					<div className='col-lg-6'>
	    						<button onClick={() => this.update()} className='orange-bc update'>Update</button>
	    					</div>
	    				</div>

	    			}	
	    		</div>
	    	</React.Fragment>
    	);
    }
}

export {NewAgendaItem};
export default Agenda;