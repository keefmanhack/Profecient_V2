import React from 'react';
import {convertToMilitary, convertToStandard} from './Agenda_Helper';

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
		}

		this.intervalHandler = null;
	}

	incrementHandler(val){
		let timeCopy = this.state[val];
		this.setState({
			[val]: increment(1, timeCopy)
		})
		let ct =2;
		this.intervalHandler = setInterval(
			() => {
				timeCopy = this.state[val];
				this.setState({
					[val]: increment(ct++, timeCopy)
				})
				
			} 

		, 500)
	}
	stopInterval(){
		clearInterval(this.intervalHandler);
	}

	decrementHandler(val){
		let timeCopy = this.state[val];
		this.setState({
			[val]: decrement(1, timeCopy)
		})
		let ct =2;
		this.intervalHandler = setInterval(
			() => {
				timeCopy = this.state[val];
				this.setState({
					[val]: decrement(ct++, timeCopy)
				})
				
			} 

		, 300)
	}

	render(){
		// const containHeight = 200;
		// const dif = convertToMilitary(this.state.endTime) - convertToMilitary(this.state.startTime);
		// const count = Math.floor(4800/dif);
		// const each = containHeight/count;
		// const spacing = 160 - (.1 * convertToMilitary(this.state.startTime));

		// let arr =[];
		// console.log(4800/dif);

		// for(let i =1; i <= count; i++){
		// 	arr.push(
		// 		{
		// 			t: 'text',
		// 			spacing: i* spacing,
		// 		}
		// 	);
		// }

		let arr = [];
		const startTimeMT = convertToStandardNum(convertToMilitary(this.state.startTime));
		const endTimeMT = convertToStandardNum(convertToMilitary(this.state.endTime));
		const dif = endTimeMT - startTimeMT;
		console.log(dif)
		console.log(endTimeMT)
		console.log(startTimeMT)
		const num = Math.floor(dif/50);

		let startTime = roundTimeDown(this.state.startTime);
		for(let i =0; i <= num; i++){
			
			arr.push(startTime);

			startTime= increment(4, startTime, true);
		}

		const timeHRs = arr.map((data, index) =>
			<TimeHR spacing={index*(120/(arr.length-1)) + 20 + convertToStandardNum(convertToMilitary(arr[0])) - startTimeMT} time={data} />
		);

		

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
					/>
				</div>
			</div>
		);
	}
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
		<div>
			<div className='top-con'>
				<Scaler
					decMouseDown={() => props.decrementHandler('startTime')}
					mouseUp={() => props.stopInterval()}
					incMouseDown={() => props.incrementHandler('startTime')}
				/>
			</div>
			<div className='timeDis'>
				<input value={props.startTime} className='topIn' type="text" placeholder='12:00AM'/>
				<input value={props.endTime} className='bottomIn' type="text" placeholder='2:00PM'/>
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

function decrement(ct, time){
	const timeMT = convertToMilitary(time);
	let incrementVal = findIncrementVal(ct);
	let incrmentedMT;

	if(ct < 6){
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

export default SemesterCreator;