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

const findLinks = User => async (classSearchData, currentLinks) => {
	if(!classSearchData){
		throw new Error('No data for link search');
	}
	let returnLinks = [];
	const foundUsers =  await User.find({}).populate({
						path: 'semesters',
						populate: {
								path: 'classes',
								match: {
									name: {"$regex": classSearchData.name },
									location: {"$regex": classSearchData.location, "$options": "i" },
									instructor: {"$regex": classSearchData.instructor, "$options": "i" },
									_id: {'$ne': currentLinks.length>0 ? currentLinks.map(function(link){ //filters out links that already exist
										return link.class._id;
									}): null}
								}
						}
					})

	if(foundUsers){
		foundUsers.forEach(function(foundUser){
			// console.log(foundUser.semesters + foundUser.name);
			let currentSem = foundUser.semesters[foundUser.semesters.length-1]; //current semester
			if(currentSem && currentSem.classes){ //only get current semesters
				currentSem.classes.forEach(function(o){
					const linkStruct ={
						user: {
							name: foundUser.name,
							profilePictureURL: foundUser.profilePictureURL,
							_id: foundUser._id,
						},
						class: o,
					}
					
					returnLinks.push(linkStruct);
				})
			}
		})
	}
	return returnLinks;
}

const postNewNotification = User => async (id, newNoteID) => {
	if(!id || !newNoteID){
		throw new Error('Missing notification data to post');
	}
	const user = await User.findById(id);
	user.notifications.academic.unDismissed++;
	user.notifications.academic.classNote.unshift(newNoteID);
	return await user.save();
}


module.exports = User => {
	return {
		createUser: createUser(User),
		findById: findById(User),
		findUsersByName: findUsersByName(User),
		toggleUserFriend: toggleUserFriend(User),
		deleteAcNotif : deleteAcNotif(User),
		findMultiple: findMultiple(User),
		findLinks: findLinks(User),
		postNewNotification: postNewNotification(User)
	}
}

