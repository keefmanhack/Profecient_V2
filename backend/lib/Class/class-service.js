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
			foundClass.connectionsTo.pull(i);
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
			foundClass.connectionsFrom.pull(i);
			await foundClass.save();
			return;
		}
	}
	foundClass.connectionsFrom.push({user: otherUserID, class_data: otherUserClassID});
	await foundClass.save();
}

module.exports = ClassModel => {
	return {
		getClassesOccuringToday: getClassesOccuringToday(ClassModel),
		toggleConnectionTo: toggleConnectionTo(ClassModel)
	}
}