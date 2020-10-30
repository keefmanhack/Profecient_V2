const BaseRequests = require('../BaseServiceRequests');
const NotificationService = require('../Notification/index');

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

const create = User => async data => {
	let user = new User(data);
	user.following.push(user._id);
	user.notifications.relations.notifBucket = await NotificationService.create();//need to add others in the future
	return await user.save();
}

const deleteById = User => async id => {
	if(!id){
		throw new Error("Missing id to delete user");
	}
	const foundUser = await User.findById(id);
	NotificationService.deleteById(foundUser.notifications.relations.notifBucket);
	await User.findByIdAndRemove(id);
}

const incrementRelationsNotifCt = User => async id => {
	if(!id){
		throw new Error('Missing id to increment rel notifs');
	}
	const foundUser = await User.findById(id);
	foundUser.notifications.relations.unDismissed++;
	return await foundUser.save();
}

const decrementRelationsNotifCt = User => async id => {
	if(!id){
		throw new Error('Missing id to decrement rel notifs');
	}
	const foundUser = await User.findById(id);
	foundUser.notifications.relations.unDismissed--;
	return await foundUser.save();
}

const insertNewPost = User => async (id, newPostID) => {
	if(!id || !newPostID){
		throw new Error("Missing data to add a new post to user");
	}
	const foundUser = await User.findById(id);
	foundUser.posts.unshift(newPostID);
	return await foundUser.save();
}

const getRelationNotifBucketID = User => async id => {
	if(!id){
		throw new Error('Missing data to find relational notifBucket ID');
	}
	const foundUser = await User.findById(id);
	return foundUser.notifications.relations.notifBucket;
}

const subtractRelationNotifCT = User => async (id, val) => {
	if(!id){
		throw new Error('Missing id');
	}
	const foundUser = await User.findById(id);
	foundUser.notifications.relations.unDismissed-=val;
	if(foundUser.notifications.relations.unDismissed<0){foundUser.notifications.relations.unDismissed=0}
	return foundUser.save();
}

module.exports = User => {
	return {
		findById: BaseRequests.findById(User),
		size: BaseRequests.size(User),
		findMultiple: BaseRequests.findMultipleById(User),

		deleteById: deleteById(User),
		create: create(User),
		findUsersByName: findUsersByName(User),
		toggleUserFollowing: toggleUserFollowing(User),
		deleteAcNotif : deleteAcNotif(User),
		findLinks: findLinks(User),
		toggleUserFollowers: toggleUserFollowers(User),
		incrementRelationsNotifCt: incrementRelationsNotifCt(User),
		decrementRelationsNotifCt: decrementRelationsNotifCt(User),
		insertNewPost: insertNewPost(User),
		getRelationNotifBucketID: getRelationNotifBucketID(User),
		subtractRelationNotifCT: subtractRelationNotifCT(User),
	}
}

