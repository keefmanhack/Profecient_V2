import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

import {SuccessCheck} from './lottie/LottieAnimations';
import {findTopPosition, findHeightProportion, dateObjToStdTime, convertToStdDate} from './Agenda_Helper';
import StartEndTime from './Semester Creator/StartEndTimeComp/StartEndTime';
import {FadeInOut_HandleState} from './CustomTransition';

class Agenda extends React.Component{
	constructor(props){
		super(props);
		
		this.times = ['12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM', '4:00AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM', '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM', '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM' ]
		
		this.scrollBox = React.createRef();
	}

	componentDidMount(){
		const date = new Date();
		const currTime = dateObjToStdTime(date);

		this.scrollBox.current.scrollTop=findTopPosition(currTime);
	}
	
	render(){
		const timeHRs = this.times.map((time, index) =>
			<TimeHR time={time} spacing={index*25} key={index}/>
		);

		const AgendaItems = this.props.agendaItems.map((data, index) => {
			const startTime = moment(data.time.start);
			const endTime = moment(data.time.end);

			const topDis = startTime.diff(moment().startOf('Day'), 'minutes') /30.0 * 25;
			const height = endTime.diff(startTime, 'minutes') /30.0 * 25;
			return <AgendaItem 
				key={index}
				height={height} 
				top={topDis} 
				name={data.name} 
				location={data.location}
				zIndex={index}
			/>
		});

		return(
			<div className='agenda sans-font' style={{position: 'relative'}}>
				<h1 className='gray-c'>Agenda</h1>
				<h4 className='gray-c'>{convertToStdDate(new Date())}</h4>
				<button className='see-more gray-c'>See More</button>
				<button onClick={() => this.props.showNewAgForm()} className='add green-bc'>Add</button>
				<div ref={this.scrollBox} className='foreground'>
					{timeHRs}
					{AgendaItems}
				</div>
			</div>
		);
	}

}


class AgendaItem extends React.Component{
	constructor(props){
		super(props);

		this.state={
			mouseOver: false,
		}
	}

	render(){
		return(
			<div 
				onMouseEnter={() => this.setState({mouseOver:true})} 
				onMouseLeave={() => this.setState({mouseOver:false})} 
				style={{height: this.props.height, top: this.props.top, zIndex: this.props.zIndex}} 
				className={this.props.isClass ? 'blue-bc item-container' : 'light-green-bc item-container'}
			>
				<h2>{this.props.name}</h2>
				<h3>{this.props.location}</h3>
				<FadeInOut_HandleState condition={this.state.mouseOver}>
					<div>
						<button className='edit'>Edit</button>
						<button className='delete'>Delete</button>	
					</div>
				</FadeInOut_HandleState>
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

		this.state ={
			time:{
				start: '2:00PM',
				end: '4:00PM',
			},
			date: new Date(),
			errors: {
				name: false,
			},
			success: false,
		}

		this.wrapperRef = React.createRef();
		this.name = React.createRef();
		this.location = React.createRef();
		this.description = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	setTime(key, time){
		let time_copy = this.state.time;
		time_copy[key] = time;
		this.setState({
			time: time_copy,
		})
	}



	// Server interaction
	submitForm(){
		const error = this.checkErrors();

		if(!error){
			const data = {
				name: this.name.current.value,
				location: this.location.current.value,
				description: this.description.current.value,
				time: this.state.time,
				date: this.state.date,
			}

			this.props.sendData(data);
		}

		//if no errors post data to server
		//going to need to setup a way to see all upcomming events for a week/month/calendar
		//editing events and deleting
	}

	checkErrors(){
		let error = false;
		let error_copy = this.state.errors;

		if(this.name.current.value === ''){
			error=true;
			error_copy.name = true;
		}else{
			error_copy.name = false;
		}

		this.setState({
			errors: error_copy,
		})


		return error;
	}

	dateChanged(date){
		this.setState({
			date: date
		})
	}
	// End Of Server Interaction


	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hideNewAgForm();
        }
    }

    render(){
    	return(
    		<div ref={this.wrapperRef} className='new-ag-it-cont sans-font form-bc new-form'>
    			<FadeInOut_HandleState condition={this.props.success}>
	 				<SuccessCheck onCompleted={() =>this.props.hideNewAgForm()}/>
	 			</FadeInOut_HandleState>
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
    					<StartEndTime time={this.state.time} setTime={(key, time) => this.setTime(key, time)}/>
    				</div>
    				<div className='col-lg-6'>
	    				<DatePicker
				        	selected={this.state.date}
				        	onChange={(date) => this.dateChanged(date)}
				      	/>
    					<textarea ref={this.description} placeholder='Description'></textarea>
    				</div>
    			</div>
    			<button onClick={() => this.submitForm()} className='blue-bc submit'>Submit</button>
    		</div>
    	);
    }
}

export {NewAgendaItem};
export default Agenda;