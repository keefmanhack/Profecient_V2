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

const toggleConnectionTo = ClassModel => async (myClassID, otherUserID, otherUserClassID) =>{
	if(!myClassID || !otherUserID || !otherUserClassID){
		throw new Error("Missing connection to data");
	}
	const foundClass = await ClassModel.findById(myClassID);
	for(let i =0; i< foundClass.connectionsTo.length; i++){
		const connection = foundClass.connectionsTo[i];
		if(connection.user == otherUserID && connection.class_data == otherUserClassID){
			foundClass.connectionsTo.splice(i, i+1);
			await foundClass.save();
			return;
		}
	}
	foundClass.connectionsTo.push({user: otherUserID, class_data: otherUserClassID});
	await foundClass.save();
}

const toggleConnectionFrom = ClassModel => async (myClassID, otherUserID, otherUserClassID) =>{
	if(!myClassID || !otherUserID || !otherUserClassID){
		throw new Error("Missing connection to data");
	}
	const foundClass = await ClassModel.findById(myClassID);
	for(let i =0; i< foundClass.connectionsFrom.length; i++){
		const connection = foundClass.connectionsFrom[i];
		if(connection.user == otherUserID && connection.class_data == otherUserClassID){
			foundClass.connectionsFrom.splice(i, i+1);
			await foundClass.save();
			return;
		}
	}
	foundClass.connectionsFrom.push({user: otherUserID, class_data: otherUserClassID});
	await foundClass.save();
}

const create = ClassModel => async data =>{
	if(!data){
		throw new Error('No class Data');
	}
	return await ClassModel.create(data);
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

const findById = ClassModel => async id => {
	if(!id){
		throw new Error('No id given');
	}
	return await ClassModel.findById(id);
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

module.exports = ClassModel => {
	return {
		getClassesOccuringToday: getClassesOccuringToday(ClassModel),
		toggleConnectionTo: toggleConnectionTo(ClassModel),
		create: create(ClassModel),
		updateClasses: updateClasses(ClassModel),
		deleteMultiple: deleteMultiple(ClassModel),
		findById: findById(ClassModel),
		getAllClassAssIDs: getAllClassAssIDs(ClassModel),
		getClassAssignmentsDueInAWeekSortedByDate: getClassAssignmentsDueInAWeekSortedByDate(ClassModel),
	}
}