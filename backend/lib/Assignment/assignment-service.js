const moment = require('moment');
const BaseRequests = require('../BaseServiceRequests');

const deleteMultiple = Ass => async ids =>{
	if(!ids){
		return;
	}
	for(let i =0; i< ids.length; i++){
		await Ass.findByIdAndRemove(ids[i]);
	}
}

const getAssesDueInAWeekSortedByDate = Ass => async ids =>{
	if(!ids){
		throw new Error('No ids supplied');
	}
	const asses = await Ass.find({_id: ids, dueDate: {$lte: new Date(moment().add(1, 'weeks'))},complete: false,});
	return asses.slice().sort((a,b) => a.dueDate-b.dueDate);
}


const create = Ass => async data =>{
	if(!data){
		throw new Error('No assignment data');
	}
	const newAss = await Ass.create(data);
	newAss.complete = false;
	return await newAss.save();
}

const findMultiple = Ass => async ids => {
	if(!ids){
		throw new Error("No ids supplied to find assginments");
	}
	return await Ass.find({_id: ids});
}

module.exports = Ass => {
	return {
		deleteMultiple: deleteMultiple(Ass),
		deleteOne: BaseRequests.deleteById(Ass),
		getAssesDueInAWeekSortedByDate: getAssesDueInAWeekSortedByDate(Ass),
		update: BaseRequests.update(Ass),
		create: create(Ass),
		findMultiple: findMultiple(Ass),
	}
}