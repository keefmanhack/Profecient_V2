import React from 'react';
import {FadeInOut_HandleState} from '../../CustomTransition';
import {increment, checkDif, decrement, assembleTime, findMinute, findHour, findAMPM, createTimeHRs, createHours, createMins} from './helperFunc';

class StartEndTime extends React.Component{
	constructor(props){
		super(props);

		this.state={
			error: false,
		}

		this.intervalHandler = null;
	}

	incrementHandler(val){
		let timeCopy = this.props.time[val];
		let inc = increment(1, timeCopy);

		if(checkDif(val, this.props.time.start, this.props.time.end, inc)){
			this.props.setTime(val, inc);
			this.setState({
				 error: false,
			})
		}else{
			this.setState({
				error: true,
			})
		}


		let ct =2;
		this.intervalHandler = setInterval(
			() => {
				timeCopy = this.props.time[val];
				inc = increment(ct++, timeCopy);

				if(checkDif(val, this.props.time.start, this.props.time.end, inc)){
					this.props.setTime(val, inc);
					this.setState({
						 error: false,
					})
				}else{
					this.setState({
						error: true,
					})
				}	
			} 

		, 500)
	}
	stopInterval(){
		clearInterval(this.intervalHandler);
	}

	decrementHandler(val){
		let timeCopy = this.props.time[val];
		let dec = decrement(1, timeCopy);

		if(checkDif(val, this.props.time.start, this.props.time.end, dec)){
			this.props.setTime(val, dec);
			this.setState({
				 error: false,
			})
		}else{
			this.setState({
				error: true,
			})
		}

		let ct =2;
		this.intervalHandler = setInterval(
			() => {
				timeCopy = this.props.time[val];
				dec = decrement(ct++, timeCopy);
				if(checkDif(val, this.props.time.start, this.props.time.end, dec)){
				this.props.setTime(val, dec);       
					this.setState({
						 error: false,
					})
				}else{
					this.setState({
						error: true,
					})
				}
			} 

		, 300)
	}

	handleHourInput(e, str){
		const min = findMinute(this.props.time[str]);
		const AMPM = findAMPM(this.props.time[str]);
		
		const stdTime = assembleTime(e.target.value, min, AMPM);
		
		if(checkDif(str, this.props.time.start, this.props.time.end, stdTime)){
		this.props.setTime(str, stdTime);   
			this.setState({
				error: false,
			})
		}else{
			this.setState({
				error: true
			})
		}
		
	}

	handleMinInput(e, str){
		const hour = findHour(this.props.time[str]);
		const AMPM = findAMPM(this.props.time[str]);
		
		const stdTime = assembleTime(hour, e.target.value, AMPM);

		if(checkDif(str, this.props.time.start, this.props.time.end, stdTime)){
		this.props.setTime(str, stdTime);   
			this.setState({
				error: false,
			})
		}else{
			this.setState({
				error: true
			})
		}
	}

	handleAMPMInput(e, str){
		const min = findMinute(this.props.time[str]);
		const hour = findHour(this.props.time[str]);
		
		const stdTime = assembleTime(hour, min, e.target.value);

		if(checkDif(str, this.props.time.start, this.props.time.end, stdTime)){
			this.props.setTime(str, stdTime);   
			this.setState({
				error: false,
			})
		}else{
			this.setState({
				error: true
			})
		}
	}

	render(){
		let timeHRs = createTimeHRs(this.props.time.start, this.props.time.end);

		return(
			<div className='start-end-time-container'>
				<div className='time-container'>
					{timeHRs}
					<TimeUnit
						decrementHandler={(str) => this.decrementHandler(str)}
						incrementHandler={(str) => this.incrementHandler(str)}
						stopInterval={() => this.stopInterval()}
						startTime={this.props.time.start}
						endTime={this.props.time.end}
						handleHourInput={(e, str) => this.handleHourInput(e, str)}
						handleMinInput={(e, str) => this.handleMinInput(e, str)}
						handleAMPMInput={(e, str) => this.handleAMPMInput(e, str)}
					/>
				</div>
				<FadeInOut_HandleState condition={this.state.error}>
					<h5 style={{color: 'red'}} className='error-message'>The head must come before the tail</h5>
				</FadeInOut_HandleState>
			</div>
		);
	}
}




export function TimeHR(props){

	const hrStyle= !props.time.includes('3') ? {borderTopWidth: 2} : null;

	return(
		<div style={{top: props.spacing}} className='time-hr'>
			<hr style={hrStyle}/>
			<h5>{props.time}</h5>
		</div>
	);
}

function TimeUnit(props){
	return(
		<div className='time-unit'>
			<div className='top-con'>
				<Scaler
					decMouseDown={() => props.decrementHandler('start')}
					mouseUp={() => props.stopInterval()}
					incMouseDown={() => props.incrementHandler('start')}
				/>
			</div>
			<div className='timeDis'>
				<h5 className='topIn' >
					<TimeShowEdit 
						handleHourInput={(e) => props.handleHourInput(e, 'start')} 
						handleMinInput={(e) => props.handleMinInput(e, 'start')} 
						handleAMPMInput={(e) => props.handleAMPMInput(e, 'start')} 
						time={props.startTime} 
					/>
				</h5>
				<h5 className='bottomIn' >
					<TimeShowEdit
						handleHourInput={(e) => props.handleHourInput(e, 'end')} 
						handleMinInput={(e) => props.handleMinInput(e, 'end')} 
						handleAMPMInput={(e) => props.handleAMPMInput(e, 'end')} 
						time={props.endTime}
					/>
				</h5>
			</div>
			<div className='bottom-con'>
				<Scaler
					decMouseDown={() => props.decrementHandler('end')}
					mouseUp={() => props.stopInterval()}
					incMouseDown={() => props.incrementHandler('end')}
				/>
			</div>
		</div>
	);
}

function TimeShowEdit(props){
	return(
		<div style={{position: 'relative'}}>
			<select onChange={(e) => props.handleHourInput(e)} value={findHour(props.time)}>
				{createHours()}
			</select>
			:
			<select onChange={(e) => props.handleMinInput(e)} value={findMinute(props.time)}>
				{createMins()}
			</select>
			<select onChange={(e) => props.handleAMPMInput(e)} className='AMPM' value={props.time.includes('AM') ? 'AM' : 'PM'}>
				<option>AM</option>
				<option>PM</option>
			</select>
		</div>
	);
}

function Scaler(props){
	return(
		<div>
			<button 
				onMouseUp={() => props.mouseUp()} 
				onMouseDown={() => props.decMouseDown()} 
				className='up'
			><i class="fas fa-caret-up"></i></button>
			<button 
				onMouseUp={() => props.mouseUp()} 
				onMouseDown={() => props.incMouseDown()} 
				className='down'
			><i class="fas fa-caret-down"></i></button>
		</div>
	);
}

export default StartEndTime;