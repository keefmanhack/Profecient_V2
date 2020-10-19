const moment = require('moment');

const deleteMultiple = Ass => async ids =>{
	if(!ids){
		return;
	}
	for(let i =0; i< ids.length; i++){
		await Ass.findByIdAndRemove(ids[i]);
	}
}

const deleteOne = Ass => async id => {
	if(!id){
		throw new Error('No id');
	}
	Ass.findByIdAndRemove(id);
}

const getAssesDueInAWeekSortedByDate = Ass => async ids =>{
	if(!ids){
		throw new Error('No ids supplied');
	}
	const asses = await Ass.find({_id: ids, dueDate: {$lte: new Date(moment().add(1, 'weeks'))},complete: false,});
	return asses.slice().sort((a,b) => a.dueDate-b.dueDate);
}

const update = Ass => async (id, data) =>{
	if(!id || !data){
		throw new Error('No id or data supplied for assignment update');
	}
	return await Ass.findByIdAndUpdate(id, data);
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
		deleteOne: deleteOne(Ass),
		getAssesDueInAWeekSortedByDate: getAssesDueInAWeekSortedByDate(Ass),
		update: update(Ass),
		create: create(Ass),
		findMultiple: findMultiple(Ass),
	}
}