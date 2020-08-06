export function checkDateDif(startArr, endArr){
	if(parseInt(endArr[2]) - parseInt(startArr[2]) >= 1){
		return true;
	}else if(parseInt(endArr[2]) - parseInt(startArr[2]) ===0){
		if(parseInt(endArr[0]) - parseInt(startArr[0]) >= 1){
			return true;
		}else if(parseInt(endArr[0]) - parseInt(startArr[0]) ===0){
			if(parseInt(endArr[1]) - parseInt(startArr[1]) >0){
				return true;
			}
		}
	}
	return false;
}

export function checkDate(arr){
	const monthToDays ={
		1: 31,
		2: 29,
		3: 31,
		4: 30,
		5: 31,
		6: 30,
		7: 31,
		8: 31,
		9: 30,
		10: 31,
		11: 30,
		12: 31,
	}
	
	if(arr.length===3){
		if(parseInt(arr[0]) > 0 && parseInt(arr[0]) < 13){
			const month = parseInt(arr[0]);
			const day = parseInt(arr[1]);

			if(day > 0 && day <= monthToDays[month]){
				if(parseInt(arr[2]) !== 'Nan' && arr[2].length === 4){
					return true;
				}
			}
		}
	}
	return false;
}