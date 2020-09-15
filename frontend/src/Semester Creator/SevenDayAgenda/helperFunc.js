import {convertToStandardNum, increment, findIncrementVal, decrement, roundTimeDown, findProportionalTimeDif} from '../StartEndTimeComp/helperFunc';
import {convertToMilitary} from '../../Agenda_Helper';
import moment from 'moment';

export function convertToAgendaFormat(data){
	if(data.length >0){
		const sortedData = sortByStartTime(data);

		const intervalDivider = 30;


		const firstEvent = moment(sortedData[0].time.start).subtract(1, 'hours');
		const lastEvent = moment(sortedData[sortedData.length-1].time.end).add(1, 'hours');
		const timeDif = lastEvent.diff(firstEvent, 'minutes'); //time is already proportioned out of 100

		const intervals = Math.ceil(timeDif/intervalDivider) + 1;
		const firstEvent_stdNum = firstEvent.diff(0, 'minutes');

		let arr = []
		
		const remainder = 30 - (firstEvent.minute() % 30);
		const roundedTime = moment(firstEvent).add(remainder, "minutes");
		let timeInc = roundedTime;
		for(let i =0; i < intervals; i++){
			const currentTimeInt = [intervalDivider * i + firstEvent_stdNum, intervalDivider * (i+1) + firstEvent_stdNum-1];

			let weekArr = []
				for(let i =0; i<sortedData[0].daysOfWeek.length; i++){
					let dayArr = [];
					sortedData.forEach(function(o){
						const timeEvent_stdNum = moment(o.time.start).diff(0, 'minutes')
						if(currentTimeInt[0] <= timeEvent_stdNum && timeEvent_stdNum <= currentTimeInt[1] && o.daysOfWeek[i]){
							dayArr.push(o);
						}
					})
					weekArr.push(dayArr);
				}

			//rounds time
			arr.push({time: timeInc.format("h:mm a"), weekArr: weekArr});
			timeInc = timeInc.add(30, 'minutes');
		}

		return arr;
	}
	
	return null;
}

function sortByStartTime(arr){
	let sortedArr = arr;

	for(let i =0; i <sortedArr.length; i++){
		const timeVal = moment(sortedArr[i].time.start);

		for(let j =0; j< sortedArr.length; j++){
			const relTimeVal = moment(sortedArr[j].time.start);

			if(relTimeVal.isAfter(timeVal)){
				const temp = sortedArr[i];
				sortedArr[i] = sortedArr[j];
				sortedArr[j] = temp;
			}
		}
	}

	return sortedArr;
}