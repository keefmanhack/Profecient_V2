export function findTopPosition(start){
	const startMT = convertToMilitary(start);
	const startHour = parseInt((startMT+ '').substring(0, (startMT+'').length-2)) * 100;
	const startMinute = parseInt((startMT+ '').substring((startMT+ '').length-2, (startMT + '').length));

	const timeInDay = 2400;
	const agendaLength = 48 * 25;
	const convertMin = (startMinute/60)*100


	if (startHour){
		return (((startHour+convertMin)/2400)* agendaLength) + 17
	}else{
		return ((convertMin/2400)* agendaLength) + 17
	}
}

export function findHeightProportion(start, end){
	const startMT = convertToMilitary(start);
	const endMT = convertToMilitary(end);

	return (endMT - startMT)/100 * 50;
}

export function convertToMilitary(stdTime){
	const minute = parseInt(stdTime.substring(stdTime.length-4 ,stdTime.length-2));
	const hour = parseInt(stdTime.substring(0 ,stdTime.length-5));

	if(stdTime.includes('PM') && hour === 12){
		return (hour*100 + minute)
	}else if(stdTime.includes('PM')){
		return (hour * 100 + minute) + 1200;
	}else if(hour === 12){
		return minute; 
	}else{
		return hour * 100 + minute;
	}
}

export function convertToStandard(mtTime){
	let mtTimeStr = mtTime + '';
	if(parseInt(mtTime) > 2359){
		return '11:59PM';
	}else if(mtTime < 0){
		return '12:01AM';
	}else{
		if(mtTimeStr.length >3){
			const minute = mtTimeStr.substring(mtTimeStr.length-2, mtTimeStr.length);
			if(mtTime < 1200){
				const hour = mtTimeStr.substring(0, 2);
				return hour + ':'  + minute + 'AM'; 
			}else if(mtTime<1300){
				return '12' + ':'  + minute + 'PM';
			}else if(mtTime < 2200){
				const hour = ((mtTime-1200) + '').substring(0,1);
				return hour + ':'  + minute + 'PM';
			}else if(mtTime < 2400){
				const hour = ((mtTime-1200) + '').substring(0,2);
				return hour + ':'  + minute + 'PM';
			}
		}else if(mtTimeStr.length > 2){
			const minute = mtTimeStr.substring(mtTimeStr.length-2, mtTimeStr.length);
			const hour = mtTimeStr.substring(0, 1);
			return hour + ':'  + minute + 'AM';
		}else if(mtTimeStr.length>1){
			return '12:' + mtTimeStr + 'AM';
		}else if(mtTimeStr.length>0){
			return '12:' + '0' + mtTimeStr + 'AM'; 
		}else{
			return null;
		}
		return '10:10AM'
	}
}

export function dateObjToStdTime(date){
	return convertToStandard(convertFromDateObjToMT(date));
}

export function	convertFromDateObjToMT(date){
	const hour = date.getHours();
	const minute = date.getMinutes();
	const mtTime = hour*100 + minute;
	return mtTime;
}

export function convertToStdDate(date){
	const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	let dateObj = new Date(date);

	const month = months[dateObj.getMonth()];
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();
	const time = dateObj.toLocaleTimeString();

	const reformattedTime = time.substring(0,time.length-6) + time.substring(time.length-3,time.length);
	
	// const time = dateObj.toTimeString();
	return month + ' ' + day + ', ' + year + ' ' + reformattedTime;

}