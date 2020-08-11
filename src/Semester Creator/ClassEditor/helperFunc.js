class CE_Errors{
	constructor(matchingError, dataToMatch){
		this.error = false;
		this.matchingError = matchingError;
		this.dataToMatch = dataToMatch;
	}

	checkInputs(x){
		for(let key in this.matchingError){
			if(key !== x){
				if(this.dataToMatch[key] === null || this.dataToMatch[key].length < 1){
					console.log(key)
					this.matchingError[key] = true;
					this.error = true;
				}else{
					this.matchingError[key] = false;
				}
			}
		}
	}

	checkDaysOfWeek(key){
		let ct =0;
		this.dataToMatch.daysOfWeek.forEach((x) =>{
			if(x){
				ct++;
			}
		})

		if(ct<1){
			this.matchingError.daysOfWeek = true;
			this.error= true;
		}else{
			this.matchingError.daysOfWeek = false;
		}
	}

	checkStartEndDate(){
		console.log(this.matchingError);
		for(let key in this.matchingError.date){
			if(this.dataToMatch.date[key] === null || this.dataToMatch.date[key].length < 1){
				this.matchingError.date[key] = true;
				console.log(key)
				this.error = true;
			}else{
				this.matchingError.date[key] = false;
			}
		}

		console.log(this.matchingError);


		if(!this.matchingError.date.start && !this.matchingError.date.end){
			const startArr = this.dataToMatch.date.start.split('/');
			const endArr = this.dataToMatch.date.end.split('/');
			if(checkDate(startArr)){
				if(checkDate(endArr)){
					if(!checkDateDif(startArr, endArr)){
						this.matchingError.date.end = true;
						this.error=true;
					}
				}else{
					this.matchingError.date.end = true;
					this.error=true;
				}
			}else{
				this.matchingError.date.start = true;
				this.error=true;
			}
		}
	}

	getError(){
		return this.error;
	}

	getErrorsObject(){
		return this.matchingError;
	}
}

function checkDateDif(startArr, endArr){
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

function checkDate(arr){
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
export default CE_Errors;