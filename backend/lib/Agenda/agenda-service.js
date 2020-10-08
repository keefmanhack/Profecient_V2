const endOfDay =  require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

const getTodaysItems = Agenda => async agendaIds => {
	if(!agendaIds){
		throw new Error('No Agenda Ids');
	}

	const items = await Agenda.find({_id: agendaIds, date: {$gte: startOfDay(new Date()), $lte: endOfDay(new Date())}});
	return items;
}

const reformatClassData = Agenda => classData =>{
	if(!classData){
		throw new Error('No Class Data');
	}
	let restructClasses  = [];
	for(let i =0; i< classData.length; i++){
		const o = classData[i];
		const classRestruct = {
			name: o.name,
			location: o.location,
			description: o.instructor,
			time: o.time,
			date: new Date(),
			_id: o._id,
		}
		restructClasses.push(classRestruct);
	}

	return restructClasses;
}


module.exports = Agenda => {
	return {
		getTodaysItems: getTodaysItems(Agenda),
		reformatClassData: reformatClassData(Agenda), 
	}
}