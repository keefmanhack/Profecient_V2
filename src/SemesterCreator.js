import React from 'react';
import {convertToMilitary, convertToStandard} from './Agenda_Helper';
import {FadeInOut_HandleState} from './CustomTransition';

class SemesterCreator extends React.Component{
	render(){
		return(
			<div className='semester-creator-container'>
				<div className='row'>
					<div className='col-lg-6'>
						<div className='class-item-container'>
							<ClassItem/>
							<ClassItem/>
							<ClassItem/>
							<ClassItem/>	
						</div>

						<input type="text" placeholder='Class Name'/>
						<button>M</button>
						<button>T</button>
						<button>W</button>
						<button>T</button>
						<button>F</button>
						<button>S</button>
						<button>S</button>
						<div className='row'>
							<div className='col-lg-6'>
								<StartEndTime/>
							</div>
							<div className='col-lg-6'>
								<input type="text" placeholder='Instructor'/>
								<input placeholder='location'/>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='seven-day-agenda'>
							<table>
								<thead>
									<tr>
										<th>Mon.</th>
										<th>Tue.</th>
										<th>Wed.</th>
										<th>Thu.</th>
										<th>Fri.</th>
										<th>Sat.</th>
										<th>Sun.</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

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
		let timeHRs;
		let arr = [];

		const dif = findProportionalTimeDif(this.state.startTime, this.state.endTime);

		if(dif>0){
			const spaceFromTop = 60;
			const spacingConst = 175;

			const num = Math.ceil(dif/50) + 2;
			const startTimeMT = convertToMilitary(this.state.startTime)
			const endTimeMT = convertToMilitary(this.state.endTime)

			let startTime = decrement(4, roundTimeDown(this.state.startTime), true);
			for(let i =0; i <= num; i++){
				
				arr.push(startTime);

				startTime= increment(4, startTime, true);
			}
			
			const spacing = spacingConst/(arr.length-1);

			const topSpace = (convertToStandardNum(convertToMilitary(arr[1]))- convertToStandardNum(startTimeMT))*spacing/spaceFromTop;
			const bottomSpace = (convertToStandardNum(convertToMilitary(arr[arr.length-2])) - convertToStandardNum(endTimeMT)) * spacing/50;
			
			// console.log('rounded: ' + convertToStandardNum(convertToMilitary(arr[arr.length-2])));
			// console.log('End Time: ' + convertToStandardNum(endTimeMT))
			// console.log(bottomSpace);
			
			// - index * topSpace/(arr.length-2) + index * bottomSpace/(arr.length-2)
			//+ index * bottomSpace/(arr.length-2) + spaceFromTop + index * topSpace/(arr.length-2)
			//+ (spaceFromTop - spacing) + topSpace

			//+ (spaceFromTop - spacing) + topSpace * index * bottomSpace/(arr.length-2)
			timeHRs = arr.map((data, index) =>
				<TimeHR spacing={index*spacing - index * topSpace/(arr.length-2) + index * bottomSpace/(arr.length-2) + 32 + topSpace } time={data} />
				
			);
		}

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



function TimeHR(props){

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

function createHours(){
	let hourArr =[]

	for(var i =1; i < 13; i++){
		hourArr.push(i);
	}

	const hours = hourArr.map((data, index)=>
		<option key={index}>{data}</option>
	);

	return hours;
}

function createMins(){
	let minArr =[]

	for(var i =0; i < 60; i++){
		if(i< 10){
			minArr.push('0' + i);
		}else{
			minArr.push(i);
		}
	}

	const mins = minArr.map((data, index)=>
		<option key={index}>{data}</option>
	);

	return mins;
}

function convertToStandardNum(mtTime){
	const mtTimeStr = mtTime + '';
	let minute;
	let hour = '0';
	
	if(mtTimeStr.length > 2){
		hour = mtTimeStr.substring(0, mtTimeStr.length-2);
		minute= mtTimeStr.substring(mtTimeStr.length-2, mtTimeStr.length);
	}else if(mtTimeStr.length > 1){
		minute= mtTimeStr.substring(mtTimeStr.length-2, mtTimeStr.length);
	}else if(mtTimeStr.length > 0){
		minute= mtTimeStr.substring(mtTimeStr.length-1, mtTimeStr.length);
	}else{
		return null;
	}

	const minuteInt = parseInt(minute) * 100/60;

	if(minuteInt < 10){
		return parseInt(hour + '0' + minuteInt);
	}else{
		return parseInt( hour + minuteInt);
	}
	
}

function roundTimeDown(stdTime){
	const AMPM = stdTime.substring(stdTime.length-2, stdTime.length);
	const hour = stdTime.substring(0 ,stdTime.length-5);
	const minutes = parseInt(stdTime.substring(stdTime.length-4 ,stdTime.length-2));
	if(minutes >= 30){
		return hour + ':' + '30' + AMPM;
	}else{
		return hour + ':' + '00' + AMPM;
	}
}



function increment(ct, time, isButton){

	const timeMT = convertToMilitary(time);
	let incrementVal = findIncrementVal(ct);
	let incrmentedMT;

	if(ct < 6 && !isButton){
		let previousIncVal = findIncrementVal(ct-1);
		incrmentedMT = timeMT + incrementVal-previousIncVal;
	}else{
		incrmentedMT = timeMT + incrementVal;
	}

	const returnValStr = incrmentedMT + '';

	if(returnValStr.length>1){
		if(parseInt(returnValStr.substring(returnValStr.length-2, returnValStr.length)) >= 60){
			incrmentedMT= incrmentedMT+40;
		}
	}
	return convertToStandard(incrmentedMT);
}

function decrement(ct, time, isButton){
	const timeMT = convertToMilitary(time);
	let incrementVal = findIncrementVal(ct);
	let incrmentedMT;

	if(ct < 6 && !isButton){
		let previousIncVal = findIncrementVal(ct-1);
		incrmentedMT = timeMT - incrementVal+previousIncVal;
	}else{
		incrmentedMT = timeMT - incrementVal;
	}

	const returnValStr = incrmentedMT + '';

	if(returnValStr.length>1){
		if(parseInt(returnValStr.substring(returnValStr.length-2, returnValStr.length)) >= 60){
			incrmentedMT= incrmentedMT-40;
		}
	}
	return convertToStandard(incrmentedMT);
}

function findIncrementVal(ct){
	switch(ct){
		case 1: return 5;break;
		case 2: return 10;break;
		case 3: return 15;break;
		case 4: return 30;break;
		case 5: return 100;break;
	}

	if(ct >=6){
		return 200;
	}else{
		return 0;
	}
}

function ClassItem(props){
	return(
		<div className='class-item'>
			<div className='row'>
				<div className='col-lg-3'>
					<h1>Algebra</h1>
				</div>
				<div className='col-lg-3'>
					<h2>Dr. Lee</h2>
				</div>
				<div className='col-lg-4'>
					<h3>M T W Th F S S</h3>
				</div>
				<div className='col-lg-2'>
					
				</div>
			</div>
			<button><i class="fas fa-trash"></i></button>
		</div>
	)
}

function findProportionalTimeDif(start, end){
	const startTimeMT = convertToStandardNum(convertToMilitary(start));
	const endTimeMT = convertToStandardNum(convertToMilitary(end));
	return endTimeMT - startTimeMT;
}

function findHour(stdTime){
	return stdTime.substring(0, stdTime.length-5);
}

function findMinute(stdTime){
	return stdTime.substring(stdTime.length-4, stdTime.length-2);
}

function findAMPM(stdTime){
	return stdTime.substring(stdTime.length-2, stdTime.length);
}

function assembleTime(hour, minute, AMPM){
	return hour + ':' + minute + AMPM;
}

function checkDif(str, startTime, endTime, newTime){
	let dif;
		
	if(str === 'startTime'){
		dif =findProportionalTimeDif(newTime, endTime)
	}else{
		dif =findProportionalTimeDif(startTime, newTime)
	}
	
	if(dif>0){
		return true
	}else{
		return false;
	}
}

export default SemesterCreator;