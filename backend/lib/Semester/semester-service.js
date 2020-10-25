const BaseRequests = require('../BaseServiceRequests');

const findMutlipleAndPopulateClassAndAssignment = Semester => async ids =>{
	if(!ids){
		return [];
		// throw new Error('No ids given to find semesters');
	}
	return await Semester.find({_id: ids}).populate({path: 'classes', populate: {path: 'assignments'}});
}

const getCurrentSemester = Semester => async id =>{
	if(!id){
		throw new Error('No id');
	}
	return await Semester.findById(id).populate('classes');
}

module.exports = Semester => {
	return {
		create: BaseRequests.create(Semester),
		findById: BaseRequests.findById(Semester),
		deleteById: BaseRequests.deleteById(Semester),
		size: BaseRequests.size(Semester),
		findMultiple: BaseRequests.findMultipleById(Semester),
		
		findMutlipleAndPopulateClassAndAssignment: findMutlipleAndPopulateClassAndAssignment(Semester),
		getCurrentSemester: getCurrentSemester(Semester),
	}
}