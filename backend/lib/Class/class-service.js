const moment = require('moment');
const BaseRequests = require('../BaseServiceRequests');

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

const addConnectionFrom = ClassModel => async (id, classID, userID) => {
	if(!id || !classID || ! userID){
		throw new Error('Missing data to add a connection from');
	}
	const foundClass = await ClassModel.findById(id);
	const newConnection = {userID: userID, classID: classID};
	if(!connectionExists(foundClass.connectionsFrom, newConnection)){
		foundClass.connectionsFrom.push(newConnection);
		return await foundClass.save();
	}
}

const addConnectionTo = ClassModel => async (id, classID, userID) => {
	if(!id || !classID || ! userID){
		throw new Error('Missing data to add a connection from');
	}
	const foundClass = await ClassModel.findById(id);
	const newConnection = {userID: userID, classID: classID};
	if(!connectionExists(foundClass.connectionsTo, newConnection)){
		foundClass.connectionsTo.push(newConnection);
		return await foundClass.save();
	}
}


const updateClasses = ClassModel => async data=> {
	if(!data){
		throw new Error('No Data');
	}
	let returnArr = [];
	for(let i =0; i< data.length; i++){
		const classData = data[i];
		if(classData && classData._id){
			returnArr.push(await ClassModel.findByIdAndUpdate(classData._id, classData));
		}else{
			returnArr.push(await ClassModel.create(classData));
		}
	}
	return returnArr;
}

const deleteMultiple = ClassModel => async ids =>{
	if(!ids){
		throw new Error("No class ids");
	}

	for(let i =0; i<ids.length; i++){
		await ClassModel.findByIdAndRemove(ids[i]);
	}
}

const getAllClassAssIDs = ClassModel => async ids => {
	if(!ids){
		throw new Error('No ids supplied');
	}
	let ass = [];
	const classes =  await ClassModel.find({_id: ids});
	for(let i =0; i< classes.length; i++){
		if(classes[i].assignments.length >0){
			ass = ass.concat(classes[i].assignments);
		}
	}
	return ass;
}

const getClassAssignmentsDueInAWeekSortedByDate = ClassModel => async ids =>{
	if(!ids){
		throw new Error('No ids supplied');
	}
	const classes = await ClassModel.find({_id: ids}).populate({path: 'assignments', match: {dueDate: {$lte: new Date(moment().add(1, 'weeks'))},complete: false,}});
	let returnArr =[];
	for(let i =0; i<classes.length;i++){
		for(let j =0; j<classes[i].assignments.length; j++){
			const ass = classes[i].assignments[j];
			const newData = {ass: ass, parentClassID: classes[i]._id}
			returnArr = returnArr.concat(newData);
		}
	}
	return returnArr.slice().sort((a,b) => a.ass.dueDate-b.ass.dueDate);
}

const addAssignment = ClassModel => async (id, newAssID) => {
	if(!id || !newAssID){
		throw new Error("Missing data to add a new Assignment");
	}
	const foundClass = await ClassModel.findById(id);
	foundClass.assignments.push(newAssID);
	return await foundClass.save();
}

function connectionExists(connectionList, newConnection){
	for(let i =0; i<connectionList.length; i++){
		if(connectionList[i].userID + '' === newConnection.userID + '' && connectionList[i].classID + '' === newConnection.classID + ''){
			return true;
		}
	}
	return false;
}

module.exports = ClassModel => {
	return {
		create: BaseRequests.create(ClassModel),
		findById: BaseRequests.findById(ClassModel),
		findMultiple: BaseRequests.findMultipleById(ClassModel),
		deleteById: BaseRequests.deleteById(ClassModel),

		getClassesOccuringToday: getClassesOccuringToday(ClassModel),
		addConnectionTo: addConnectionTo(ClassModel),
		addConnectionFrom: addConnectionFrom(ClassModel),
		updateClasses: updateClasses(ClassModel),
		deleteMultiple: deleteMultiple(ClassModel),
		getAllClassAssIDs: getAllClassAssIDs(ClassModel),
		addAssignment: addAssignment(ClassModel),
		getClassAssignmentsDueInAWeekSortedByDate: getClassAssignmentsDueInAWeekSortedByDate(ClassModel),
	}
}