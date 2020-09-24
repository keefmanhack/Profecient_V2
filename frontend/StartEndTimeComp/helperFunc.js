import React from 'react';
// import {convertToMilitary, convertToStandard} from '../../Agenda_Helper';
// import {TimeHR} from './StartEndTime';

export function createTimeHRs(stdStartTime, stdEndTime){
	let timeHRs;
	let arr = [];

	const dif = findProportionalTimeDif(stdStartTime, stdEndTime);

	if(dif>0){
		const spaceFromTop = 60;
		const spacingConst = 175;

		const num = Math.ceil(dif/50) + 2;
		const startTimeMT = convertToMilitary(stdStartTime)
		const endTimeMT = convertToMilitary(stdEndTime)

		let startTime = decrement(4, roundTimeDown(stdStartTime), true);
		for(let i =0; i <= num; i++){
			
			arr.push(startTime);

			startTime= increment(4, startTime, true);
		}
		
		const spacing = spacingConst/(arr.length-1);

		const topSpace = (convertToStandardNum(convertToMilitary(arr[1]))- convertToStandardNum(startTimeMT))*spacing/spaceFromTop;
		const bottomSpace = (convertToStandardNum(convertToMilitary(arr[arr.length-2])) - convertToStandardNum(endTimeMT)) * spacing/50;

		timeHRs = arr.map((data, index) =>
			<TimeHR spacing={index*spacing - index * topSpace/(arr.length-2) + index * bottomSpace/(arr.length-2) + 32 + topSpace } time={data} />
			
		);
	}
	return timeHRs;
}

export function createHours(){
	let hourArr =[]

	for(var i =1; i < 13; i++){
		hourArr.push(i);
	}

	const hours = hourArr.map((data, index)=>
		<option key={index}>{data}</option>
	);

	return hours;
}

export function createMins(){
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

export function convertToStandardNum(mtTime){
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

export function roundTimeDown(stdTime){
	const AMPM = stdTime.substring(stdTime.length-2, stdTime.length);
	const hour = stdTime.substring(0 ,stdTime.length-5);
	const minutes = parseInt(stdTime.substring(stdTime.length-4 ,stdTime.length-2));
	if(minutes >= 30){
		return hour + ':' + '30' + AMPM;
	}else{
		return hour + ':' + '00' + AMPM;
	}
}


export function increment(ct, time, isButton){

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

export function decrement(ct, time, isButton){
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

export function findIncrementVal(ct){
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

export function findProportionalTimeDif(start, end){
	const startTimeMT = convertToStandardNum(convertToMilitary(start));
	const endTimeMT = convertToStandardNum(convertToMilitary(end));
	return endTimeMT - startTimeMT;
}

export function findHour(stdTime){
	return stdTime.substring(0, stdTime.length-5);
}

export function findMinute(stdTime){
	return stdTime.substring(stdTime.length-4, stdTime.length-2);
}

export function findAMPM(stdTime){
	return stdTime.substring(stdTime.length-2, stdTime.length);
}

export function assembleTime(hour, minute, AMPM){
	return hour + ':' + minute + AMPM;
}

export function checkDif(str, startTime, endTime, newTime){
	let dif;
		
	if(str === 'start'){
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