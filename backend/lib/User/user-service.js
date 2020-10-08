const createUser = User => userData => {
	if(!userData){
		throw new Error(`Message: ${userData}`);
	}
	const newUser = new User(userData);
	return newUser.save();
}

const findById = User => async id => {
	if(!id){
		throw new Error(`Message: ${id}`);
	}
	const user = await User.findById(id);
	return user;
}

const findUsersByName = User => async searchString => {
	if(!searchString){
		throw new Error(`Search String: ${searchString}`);
	}
	const users = await User.find({'name':  { "$regex": searchString, "$options": "i" }});
	return users;
}

const toggleUserFriend = User => async (userID, friendID) => {
	if(!userID || !friendID){
		throw new Error(`Undefined or null id`);
	}
	const currUser = await User.findById(userID);
	if(currUser.friends.includes(friendID)){
		currUser.pull(friendID);
	}else{
		currUser.push(friendID);
	}

	return currUser.save();
}

const deleteAcNotif = User => async (userID, noteID) =>{
	if(!userID || !noteID){
		throw new Error(`Undefined or null id`);
	}
	const user = await User.findById(userID);
	user.notifications.academic.classNote.pull(noteID);
	await user.save();
}

const findMultiple = User => async (ids) => {
	if(!ids){
		throw new Error('No ids');
	}
	return await User.find({_id: ids});
}



module.exports = User => {
	return {
		createUser: createUser(User),
		findById: findById(User),
		findUsersByName: findUsersByName(User),
		toggleUserFriend: toggleUserFriend(User),
		deleteAcNotif : deleteAcNotif(User),
		findMultiple: findMultiple(User),
	}
}

