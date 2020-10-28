const BaseRequests = require('../../../../BaseServiceRequests');

const create = NewFollowerNotif => async newFollowerID => {
	if(!newFollowerID){
		throw new Error("No id supplied to create followerID");
	}
	const newNote = new NewFollowerNotif({followerID: newFollowerID});
	return await newNote.save();
}


module.exports = NewFollowerNotif => {
	return{
		create: create(NewFollowerNotif),

		findById: BaseRequests.findById(NewFollowerNotif),
		deleteById: BaseRequests.deleteById(NewFollowerNotif),
		size: BaseRequests.size(NewFollowerNotif),
	}
}