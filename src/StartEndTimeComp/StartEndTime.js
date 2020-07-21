import React from 'react';
import {FadeInOut_HandleState} from '../CustomTransition';
import {increment, checkDif, decrement, assembleTime, findMinute, findHour, findAMPM, createTimeHRs, createHours, createMins} from './helperFunc';

class StartEndTime extends React.Component{
	constructor(props){
		super(props);

		this.state={
			startTime: '2:00PM',
			endTime: '4:00PM',
			error: false,
		}

		this.intervalHandler = null;
	}

	incrementHandler(val){
		let timeCopy = this.state[val];
		let inc = increment(1, timeCopy);

		if(checkDif(val, this.state.startTime, this.state.endTime, inc)){
			this.setState({
				[val]: inc,
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
				timeCopy = this.state[val];
				inc = increment(ct++, timeCopy);

				if(checkDif(val, this.state.startTime, this.state.endTime, inc)){
					this.setState({
						[val]: inc,
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
		let timeCopy = this.state[val];
		let dec = decrement(1, timeCopy);

		if(checkDif(val, this.state.startTime, this.state.endTime, dec)){
			this.setState({
				[val]: dec,
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
				timeCopy = this.state[val];
				dec = decrement(ct++, timeCopy);
				if(checkDif(val, this.state.startTime, this.state.endTime, dec)){
					this.setState({
						[val]: dec,
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
		const min = findMinute(this.state[str]);
		const AMPM = findAMPM(this.state[str]);
		
		const stdTime = assembleTime(e.target.value, min, AMPM);
		
		if(checkDif(str, this.state.startTime, this.state.endTime, stdTime)){
			this.setState({
				[str]: stdTime,
				error: false,
			})
		}else{
			this.setState({
				error: true
			})
		}
		
	}

	handleMinInput(e, str){
		const hour = findHour(this.state[str]);
		const AMPM = findAMPM(this.state[str]);
		
		const stdTime = assembleTime(hour, e.target.value, AMPM);

		if(checkDif(str, this.state.startTime, this.state.endTime, stdTime)){
			this.setState({
				[str]: stdTime,
				error: false,
			})
		}else{
			this.setState({
				error: true
			})
		}
	}

	handleAMPMInput(e, str){
		const min = findMinute(this.state[str]);
		const hour = findHour(this.state[str]);
		
		const stdTime = assembleTime(hour, min, e.target.value);

		if(checkDif(str, this.state.startTime, this.state.endTime, stdTime)){
			this.setState({
				[str]: stdTime,
				error: false,
			})
		}else{
			this.setState({
				error: true
			})
		}
	}

	render(){
		let timeHRs = createTimeHRs(this.state.startTime, this.state.endTime);

		return(
			<div className='start-end-time-container'>
				<div className='time-container'>
					{timeHRs}
					<TimeUnit
						decrementHandler={(str) => this.decrementHandler(str)}
						incrementHandler={(str) => this.incrementHandler(str)}
						stopInterval={() => this.stopInterval()}
						startTime={this.state.startTime}
						endTime={this.state.endTime}
						handleHourInput={(e, str) => this.handleHourInput(e, str)}
						handleMinInput={(e, str) => this.handleMinInput(e, str)}
						handleAMPMInput={(e, str) => this.handleAMPMInput(e, str)}
					/>
				</div>
				<FadeInOut_HandleState condition={this.state.error}>
					<h5 className='error-message'>The head must come before the tail</h5>
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
					decMouseDown={() => props.decrementHandler('startTime')}
					mouseUp={() => props.stopInterval()}
					incMouseDown={() => props.incrementHandler('startTime')}
				/>
			</div>
			<div className='timeDis'>
				<h5 className='topIn' >
					<TimeShowEdit 
						handleHourInput={(e) => props.handleHourInput(e, 'startTime')} 
						handleMinInput={(e) => props.handleMinInput(e, 'startTime')} 
						handleAMPMInput={(e) => props.handleAMPMInput(e, 'startTime')} 
						time={props.startTime} 
					/>
				</h5>
				<h5 className='bottomIn' >
					<TimeShowEdit
						handleHourInput={(e) => props.handleHourInput(e, 'endTime')} 
						handleMinInput={(e) => props.handleMinInput(e, 'endTime')} 
						handleAMPMInput={(e) => props.handleAMPMInput(e, 'endTime')} 
						time={props.endTime}
					/>
				</h5>
			</div>
			<div className='bottom-con'>
				<Scaler
					decMouseDown={() => props.decrementHandler('endTime')}
					mouseUp={() => props.stopInterval()}
					incMouseDown={() => props.incrementHandler('endTime')}
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