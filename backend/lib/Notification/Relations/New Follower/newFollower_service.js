const create = NewFollowerNotif => async newFollowerID => {
	if(!newFollowerID){
		throw new Error("No id supplied to create followerID");
	}
	const newNote = new NewFollowerNotif({followerID: newFollowerID});
	return await newNote.save();
}

const findById = NewFollowerNotif => async id => {
	if(!id){
		throw new Error("No id supplied to find Notif");
	}
	return await NewFollowerNotif.findById(id);
}

const deleteById = NewFollowerNotif => async id => {
	if(!id){
		throw new Error("No id supplied to delete Notif");
	}
	return await NewFollowerNotif.findByIdAndRemove(id);
}

module.exports = NewFollowerNotif => {
	return{
		create: create(NewFollowerNotif),
		findById: findById(NewFollowerNotif),
		deleteById: deleteById(NewFollowerNotif),
	}
}