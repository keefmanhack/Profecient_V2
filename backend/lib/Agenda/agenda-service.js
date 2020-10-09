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

const createNew = Agenda => async data => {
	if(!data){
		throw new Error('No agenda data');
	}
	const newItem = await Agenda.create(data);
	return newItem;
}

const updateById = Agenda => async (id, data) => {
	if(!data || !id){
		throw new Error('No agenda data or id');
	}
	await Agenda.findByIdAndUpdate(id, data);
}

const removeById = Agenda => async id => {
	if(!id){
		throw new Error('No id');
	}
	await Agenda.findByIdAndRemove(id);
}

module.exports = Agenda => {
	return {
		getTodaysItems: getTodaysItems(Agenda),
		reformatClassData: reformatClassData(Agenda),
		createNew: createNew(Agenda),
		updateById: updateById(Agenda),
		removeById: removeById(Agenda)
	}
}