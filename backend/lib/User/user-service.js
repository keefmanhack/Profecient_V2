const BaseRequests = require('../BaseServiceRequests');
const NotificationService = require('../Notification/index');
const crypto = require('crypto');

const passport = require('passport');
const LocalStrategy = require('passport-local');

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
	//ADD TESTS TO MAKE SURE USER IS VALID
	try{
		const user = new User(data);
		user.following.push(user._id);
		user.notifications.relations.notifBucket = await NotificationService.create();
		user.notifications.academic.notifBucket = await NotificationService.create();
		await User.register(user, data.password);
		return {success: true, user: user};
	}catch(err){
		console.log(err);
		return {success: false, error: err}
	}



	// let user = new User(data);
	// user.following.push(user._id);
	// user.notifications.relations.notifBucket = await NotificationService.create();
	// user.notifications.academic.notifBucket = await NotificationService.create();
	// return await user.save();
}

const deleteAll = User => async () => {
	await User.deleteMany({});
	console.log(await User.countDocuments({}))
}

const deleteById = User => async id => {
	if(!id){
		throw new Error("Missing id to delete user");
	}
	const foundUser = await User.findById(id);
	NotificationService.deleteById(foundUser.notifications.relations.notifBucket);
	NotificationService.deleteById(foundUser.notifications.academic.notifBucket);
	await User.findByIdAndRemove(id);
}

const incrementNotifCt = User => async (id, category) => {
	if(!id){
		throw new Error('Missing id to increment rel notifs');
	}
	const foundUser = await User.findById(id);
	foundUser.notifications[category].unDismissed++;
	return await foundUser.save();
}

const decrementNotifCt = User => async (id, category) => {
	if(!id){
		throw new Error('Missing id to decrement rel notifs');
	}
	const foundUser = await User.findById(id);
	foundUser.notifications[category].unDismissed--;
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

const getNotifBucketID = User => async (id, category) => {
	if(!id){
		throw new Error('Missing data to find relational notifBucket ID');
	}
	const foundUser = await User.findById(id);
	return foundUser.notifications[category].notifBucket;
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

const validate = User => async obj => {
	const objKey = Object.keys(obj)[0];
	let validation = {isValid: false, errorCode: getErrorCode(objKey)}
	try{
		const foundItems = await User.find({email: obj[objKey]});

		if(foundItems.length === 0){
			validation = {isValid: true, errorCode: null}
		}
	}catch(err){
		return validation;
	}
	return validation;
}

const authorization = User => async (username, password, cb) => {
	console.log('trig');
	try{
		const foundUser = await User.findOne({username: username});
		if(!foundUser){
			return cb(null, {isValid: false, message: 'Username is not found'});
		}
		if(!validPassword(password, foundUser.hash, foundUser.salt)){
			return cb(null, {isValid: false, message: 'Incorrect Password'});
		}
		return cb(null, {isValid: true, user: foundUser});
	}catch(err){
		cb(err);
	}
}

const findByRefreshToken = User => async token => {
	try{
		const user = await User.findOne({reload_token: token});
		return user;
	}catch(err){
		console.log(err);
	}
}

const findByAccessToken = User => async token =>{
	try{
		const user = await User.findOne({access_token: token});
		return user;
	}catch(err){
		console.log(err);
	}
}

const setTokens = User => async (id, tokens) => {
	try{
		const user = await User.findById(id);
		user.access_token = tokens.access_token;
		user.reload_token = tokens.reload_token;
		return await user.save();
	}catch(err){
		console.log(err);
	}
}

// function validPassword(password, hash, salt){
// 	var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
//     return hash === hashVerify;
// }
// function genPassword(password) {
//     var salt = crypto.randomBytes(32).toString('hex');
//     var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
//     return {
//       salt: salt,
//       hash: genHash
//     };
// }

function getErrorCode(key){
	if(key === 'email'){
		return 0;
	}else if(key === 'phoneNumber'){
		return 1;
	}else if(key === 'username'){
		return 3;
	}
	return null;
}


module.exports = User => {
	return {
		findById: BaseRequests.findById(User),
		size: BaseRequests.size(User),
		findMultiple: BaseRequests.findMultipleById(User),

		deleteAll: deleteAll(User),
		findByRefreshToken: findByRefreshToken(User),
		findByAccessToken: findByAccessToken(User),
		setTokens: setTokens(User),
		authorization: authorization(User),
		deleteById: deleteById(User),
		create: create(User),
		findUsersByName: findUsersByName(User),
		toggleUserFollowing: toggleUserFollowing(User),
		findLinks: findLinks(User),
		toggleUserFollowers: toggleUserFollowers(User),
		incrementNotifCt: incrementNotifCt(User),
		decrementNotifCt: decrementNotifCt(User),
		insertNewPost: insertNewPost(User),
		getNotifBucketID: getNotifBucketID(User),
		subtractRelationNotifCT: subtractRelationNotifCT(User),
		validate: validate(User),
		notifCategories: {relation: 'relations', academic: 'academic'},
	}
}

