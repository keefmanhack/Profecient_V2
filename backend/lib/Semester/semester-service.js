const findById = Semester => async id => {
	if(!id){
		throw new Error('No Semester id');
	}
	return await Semester.findById(id);
}

module.exports = Semester => {
	return {
		findById: findById(Semester)
	}
}