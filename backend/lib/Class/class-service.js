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
		await foundClass.save();
		return {success: true,}
	}else{
		return {success: false, error: 'Connection exists'}
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
		await foundClass.save();
		return {success: true,}
	}else{
		return {success: false, error: 'Connection exists'}
	}
}

const removeConnectionFrom = ClassModel => async (id, classID, userID) => {
	if(!id || !classID || ! userID){
		throw new Error('Missing data to remove a connection from');
	}
	const foundClass = await ClassModel.findById(id);
	const connection = {userID: userID, classID: classID};
	const cID = connectionExists(foundClass.connectionsFrom, connection);
	if(cID){
		foundClass.connectionsFrom.pull(cID);
		await foundClass.save();
		return {success: true,}
	}else{
		return {success: false, error: 'Connection does not exist'}
	}
}

const removeConnectionTo = ClassModel => async (id, classID, userID) => {
	if(!id || !classID || ! userID){
		throw new Error('Missing data to remove a connection to');
	}
	const foundClass = await ClassModel.findById(id);
	const connection = {userID: userID, classID: classID};
	const cID = connectionExists(foundClass.connectionsTo, connection);
	if(cID){
		foundClass.connectionsTo.pull(cID);
		await foundClass.save();
		return {success: true,}
	}else{
		return {success: false, error: 'Connection does not exist'}
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

const createMultiple = ClassModel => async classArr => {
	if(!classArr){
		throw new Error('Missing data to create multiple classes');
	}
	let returnArr = [];
	for(let i =0; i<classArr.length; i++){
		const newClass = await ClassModel.create(classArr[i]);
		returnArr.push(newClass);
	}
	return returnArr;
}

const UserService = require('../User/index');
const SemesterService = require('../Semester/index');
getCurrent = ClassModel => async userID =>{
	if(!userID){
		throw new Error('Missing user ID to find user');
	}
	const user = await UserService.findById(userID);
	if(user.semesters.length<1){return []}
	const sem = await SemesterService.findById(user.semesters[user.semesters.length-1]._id);
	if(sem.classes.length < 1){return []}
	const classes = await ClassModel.find({_id: sem.classes});
	return classes;
}

function connectionExists(connectionList, newConnection){
	for(let i =0; i<connectionList.length; i++){
		if(connectionList[i].userID + '' === newConnection.userID + '' && connectionList[i].classID + '' === newConnection.classID + ''){
			return connectionList[i]._id;
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

		getCurrent: getCurrent(ClassModel),
		createMultiple: createMultiple(ClassModel),
		getClassesOccuringToday: getClassesOccuringToday(ClassModel),
		addConnectionTo: addConnectionTo(ClassModel),
		addConnectionFrom: addConnectionFrom(ClassModel),
		removeConnectionFrom: removeConnectionFrom(ClassModel),
		removeConnectionTo: removeConnectionTo(ClassModel),
		updateClasses: updateClasses(ClassModel),
		deleteMultiple: deleteMultiple(ClassModel),
		getAllClassAssIDs: getAllClassAssIDs(ClassModel),
		addAssignment: addAssignment(ClassModel),
		getClassAssignmentsDueInAWeekSortedByDate: getClassAssignmentsDueInAWeekSortedByDate(ClassModel),
	}
}