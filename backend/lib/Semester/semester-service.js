const findById = Semester => async id => {
	if(!id){
		throw new Error('No Semester id');
	}
	return await Semester.findById(id);
}

const findMultiple = Semester => async ids => {
	if(!ids){
		throw new Error("No ids received to find semesters");
	}
	return await Semester.find({_id: ids});
}

const create = Semester => async data => {
	if(!data){
		throw new Error('No data');
	}
	return await Semester.create(data);
}

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

const deleteOne = Semester => async id => {
	if(!id){
		throw new Error('No id given');
	}
	await Semester.findByIdAndRemove(id);
}

module.exports = Semester => {
	return {
		findById: findById(Semester),
		create: create(Semester),
		findMutlipleAndPopulateClassAndAssignment: findMutlipleAndPopulateClassAndAssignment(Semester),
		getCurrentSemester: getCurrentSemester(Semester),
		deleteOne: deleteOne(Semester),
		findMultiple: findMultiple(Semester),
	}
}