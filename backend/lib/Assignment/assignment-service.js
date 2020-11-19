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

const UserService = require('../User/index');
const SemesterService = require('../Semester/index');
const ClassService = require('../Class/index');
const getAll = Ass => async userID => {
	const classes = getClasses();
	let arr = [];
	for(let i =0; i< classes.length; i++){
		for(let j = 0; j<classes[i].assignments.length; j++){
			const ass = await Ass.findById(classes[i].assignments[j]);
			const assData = {
				assignment: ass,
				parentClass: {
					color: '#222342',
					name: classes[i].name,
					_id: classes[i]._id
				}
			}
			arr.push(assData);
		}
	}
	return arr;
}


get = Ass => async (userID, wasCompleted) =>{
	const classes = await getClasses(userID);
	let arr = [];
	for(let i =0; i< classes.length; i++){
		const assignments = await Ass.find({_id: classes[i].assignments, complete: wasCompleted});
		for(let j = 0; j<assignments.length; j++){
			const assData = {
				assignment: assignments[j],
				parentClass: {
					color: '#222342',
					name: classes[i].name,
					_id: classes[i]._id
				}
			}
			arr.push(assData);
		}
	}
	return arr;
}

async function getClasses(userID){
	const user = await UserService.findById(userID);
	if(user.semesters.length <1){return []}
	const lastSem = await SemesterService.findById(user.semesters[user.semesters.length-1]); //get last
	if(lastSem.classes.length <1){return []}
	const classes = await ClassService.findMultiple(lastSem.classes);
	return classes
}

module.exports = Ass => {
	return {
		update: BaseRequests.update(Ass),
		deleteById: BaseRequests.deleteById(Ass),
		findById: BaseRequests.findById(Ass),

		get: get(Ass),
		deleteMultiple: deleteMultiple(Ass),
		getAssesDueInAWeekSortedByDate: getAssesDueInAWeekSortedByDate(Ass),
		create: create(Ass),
		findMultiple: findMultiple(Ass),
		getAll: getAll(Ass),
	}
}