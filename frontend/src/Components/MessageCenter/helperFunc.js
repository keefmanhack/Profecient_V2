export function timeDifString(date){
	const today = new Date();

	if(today.getFullYear() === date.getFullYear()){
		if(today.getMonth() === date.getMonth()){
			if(today.getDate()-date.getDate() === 0){
				if(today.getHours() - date.getHours() > 1){
					return today.getHours()-date.getHours() + ' hours';
				}else if(today.getHours() - date.getHours() === 1){
					return today.getHours()-date.getHours() + ' hour';
				}else{
					if(today.getMinutes() - date.getMinutes() >1){
						return today.getMinutes()-date.getMinutes() + ' minutes';
					}else if(today.getMinutes() - date.getMinutes() === 1){
						return today.getMinutes()-date.getMinutes() + ' minute';
					}else{
						return today.getSeconds() - date.getSeconds() + ' seconds';
					}
				}
			}else if(today.getDate()-date.getDate() <7){
				return (today.getDate() - date.getDate()) + ' days';
			}else{
				return Math.floor(today.getDate()/date.getDate()) + ' weeks';
			}
		}else{
			return today.getMonth() - date.getMonth() + ' months';
		}
	}else{
		return today.getFullYear() - date.getFullYear() + ' years';
	}
}

export function toSingleCharArr(twoDArr){
	if(twoDArr){
		let returnArr =[];

		for(let i =0; i< twoDArr.length; i++){
			const tempArr = twoDArr[i];
			for(let j =0; j<tempArr.length; j++){
				returnArr.push(tempArr[j]);
			}
		}

		return returnArr;
	}else{
		return null;
	}
}

export function findSimilarity(testLength, testVal, dataString){
	if(testLength && testLength >0){
		let ct =0;
		for(let i =0; i<testLength; i++){
			if(testVal[i] === dataString[i] && testVal[i] !== '0'){
				ct++;
			}
		}
		return ct/testLength;
	}else{
		return 1;
	}
}

export function Soundex(txt){
	if(txt && txt.length){
		const words = txt.trim().split(' ');
		let returnArr = [];

		words.forEach(function(o){
			let txtArr = o.toLowerCase().split('');

			for(let i =1; i< txtArr.length; i++){
				if(txtArr[i] === 'b' || txtArr[i] === 'f' || txtArr[i] === 'p' || txtArr[i] === 'v'){
					txtArr[i] = '1';
				}else if(txtArr[i] === 'c' || txtArr[i] === 'g' || txtArr[i] === 'j' || txtArr[i] === 'k' || txtArr[i] === 'q' || txtArr[i] === 's' || txtArr[i] === 'x' || txtArr[i] === 'z'){
					txtArr[i] = '2';
				}else if(txtArr[i] === 'd' || txtArr[i] === 't'){
					txtArr[i] = '3';
				}else if(txtArr[i] === 'l'){
					txtArr[i] = '4';
				}else if(txtArr[i] === 'm' || txtArr[i] === 'n'){
					txtArr[i] = '5';
				}else if(txtArr[i] === 'r'){
					txtArr[i] = '6';
				}

				if(i+1 < txtArr.length){
					if(txtArr[i] === txtArr[i+1]){
						txtArr.splice(i+1, i+2);
					}
				}

				if(i+2 < txtArr.length){
					if(txtArr[i] === txtArr[i+2]){
						txtArr.splice(i+2, i+3);
					}
				}

				if(txtArr[i] === 'a' || txtArr[i] === 'e' || txtArr[i] === 'i' || txtArr[i] === 'o' || txtArr[i] === 'u' || txtArr[i] === 'y' || txtArr[i] === 'h' || txtArr[i] === 'w' ){
					txtArr.splice(i, i+1);
				}
			}
			
			while(txtArr.length<4){
				txtArr.push('0');
			}

			if(txtArr.length>4){
				txtArr.splice(4, txtArr.length);
			}

			returnArr.push(txtArr);
		});
		return returnArr;
	}
	return null;
}