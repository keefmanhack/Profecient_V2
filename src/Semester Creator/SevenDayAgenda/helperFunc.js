import {convertToStandardNum, increment, findIncrementVal, decrement, roundTimeDown, findProportionalTimeDif} from '../StartEndTimeComp/helperFunc';
import {convertToMilitary} from '../../Agenda_Helper';

export function convertToAgendaFormat(data){
	if(data.length >0){
		const sortedData = sortByStartTime(data);
		
		const incCt =4;
		const intervalDivider = 50;


		const firstEvent = decrement(5,roundTimeDown(sortedData[0].time.start), true);
		const lastEvent = increment(5,roundTimeDown(sortedData[sortedData.length-1].time.end), true);
		const timeDif = findProportionalTimeDif(firstEvent, lastEvent );
		const intervals = Math.ceil(timeDif/intervalDivider) + 1;
		const firstEvent_stdNum = convertToStandardNum(convertToMilitary(firstEvent));

		let arr = []
		
		let timeInc = firstEvent;
		for(let i =0; i < intervals; i++){
			const currentTimeInt = [intervalDivider * i + firstEvent_stdNum, intervalDivider * (i+1) + firstEvent_stdNum-1];

			let weekArr = []
				for(let i =0; i<sortedData[0].daysOfWeek.length; i++){
					let dayArr = [];
					sortedData.forEach(function(o){
						const timeEvent_stdNum = convertToStandardNum(convertToMilitary(o.time.start));
						if(currentTimeInt[0] <= timeEvent_stdNum && timeEvent_stdNum <= currentTimeInt[1] && o.daysOfWeek[i]){
							dayArr.push(o);
						}
					})
					weekArr.push(dayArr);
				}
			arr.push({time: timeInc, weekArr: weekArr});
			timeInc = increment(incCt, timeInc, true);
		}

		return arr;
	}else{
		return null;
	}
}

function sortByStartTime(arr){
	let sortedArr = arr;

	for(let i =0; i <sortedArr.length; i++){
		const timeVal = convertToMilitary(sortedArr[i].time.start);

		for(let j =0; j< sortedArr.length; j++){
			const relTimeVal = convertToMilitary(sortedArr[j].time.start);

			if(timeVal < relTimeVal){
				const temp = sortedArr[i];
				sortedArr[i] = sortedArr[j];
				sortedArr[j] = temp;
			}
		}
	}
	return sortedArr;

}