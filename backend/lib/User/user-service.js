const BaseRequests = require('../BaseServiceRequests');

const findUsersByName = User => async searchString => {
	if(!searchString){
		return;
	}
	const users = await User.find({'name':  { "$regex": searchString, "$options": "i" }});
	return users;
}

const toggleUserFollowing = User => async (userID, friendID, isFollowing) => {
	if(!userID || !friendID){
		throw new Error(`Undefined or null id`);
	}
	const currUser = await User.findById(userID);
	if(isFollowing){
		currUser.following.pull(friendID);
	}else{
		currUser.following.push(friendID);
	}

	return await currUser.save();
}

const toggleUserFollowers = User => async (userID, possibleFollowerID) =>{
	if(!userID || !possibleFollowerID){
		throw new Error("Missing data to toggle Followers");
	}
	const user = await User.findById(userID);
	if(user.followers.includes(possibleFollowerID)){
		user.followers.pull(possibleFollowerID);
	}else{
		user.followers.push(possibleFollowerID);
	}
	return await user.save();
}

const deleteAcNotif = User => async (userID, noteID) =>{
	if(!userID || !noteID){
		throw new Error(`Undefined or null id`);
	}
	const user = await User.findById(userID);
	user.notifications.academic.classNote.pull(noteID);
	await user.save();
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
		create: BaseRequests.create(User),
		findById: BaseRequests.findById(User),
		deleteById: BaseRequests.deleteById(User),
		size: BaseRequests.size(User),
		findMultiple: BaseRequests.findMultipleById(User),

		findUsersByName: findUsersByName(User),
		toggleUserFollowing: toggleUserFollowing(User),
		deleteAcNotif : deleteAcNotif(User),
		findLinks: findLinks(User),
		postNewNotification: postNewNotification(User),
		toggleUserFollowers: toggleUserFollowers(User)
	}
}

