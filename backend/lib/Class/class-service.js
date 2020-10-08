const moment = require('moment');

const getClassesOccuringToday = ClassModel => async classIds => {
	if(!classIds){
		throw new Error('No class Ids');
	}
	const allClasses = await ClassModel.find({_id: classIds});
	let classesToday = [];
	const now = moment();
	for(let i =0; i< allClasses.length; i++){
		const o = allClasses[i];
		if(now.isAfter(o.date.start) && now.isBefore(o.date.end) && o.daysOfWeek[now.day()]){
			classesToday.push(allClasses[i]);
		}
	}
	return classesToday;
}

module.exports = ClassModel => {
	return {
		getClassesOccuringToday: getClassesOccuringToday(ClassModel)
	}
}