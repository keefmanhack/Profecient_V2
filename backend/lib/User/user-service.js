const crypto = require('crypto');

const BaseRequests = require('../BaseServiceRequests');
const NotificationService = require('../Notification/index');
const ImageServices =  require('../S3/ImageService');



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

const create = User => async (data, cb) => {
	//ADD TESTS TO MAKE SURE USER IS VALID
	try{
		let user = new User(data);

		//setup default user settings
		user.following.push(user._id);
		user.notifications.relations.notifBucket = await NotificationService.create();
		user.notifications.academic.notifBucket = await NotificationService.create();

		await User.register(user, data.password);

		if(data.profilePictureData !== 'null'){
			const imgPath = buildProfilePicturePath(user._id);
			ImageServices.uploadImage(data.profilePictureData, imgPath, async imgPath => {
				user.profilePictureURL = imgPath;
				await user.save();
				cb({success: true});
			})
		}else{
			cb({success: true}) //needs to be written with the else or else it doesn't work
		}
	}catch(err){
		console.log(err);
		cb({success: false});
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
	let validation = {exists: true, errorCode: getErrorCode(objKey)}
	try{
		const itemCount = await User.countDocuments(obj);
		if(itemCount === 0){
			validation = {exists: false, errorCode: null}
		}
	}catch(err){
		return validation;
	}
	return validation;
}

const authorization = User => async (username, password, cb) => {
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
		user.refresh_token = tokens.refresh_token;
		return await user.save();
	}catch(err){
		console.log(err);
	}
}

// Password reset functions
const myMailer = require('../Mailer/mailer');
const moment = require('moment');
const sendforgotPasswordEmail = User => async email => {
	try{
		const user = (await User.find({email: email}))[0];
		if(!user){return {success: false, error: 'Email does not exist'}};
		const code = await generatePasswordCode();

		user.resetPasswordCode = code;
		user.resetPasswordExpires = Date.now() + 3600000; //one hour (i think)

		await user.save();
		const res = await myMailer.sendPasswordCode(user.email, code);
		if(!res.success){return {success: false, error: 'Error sending email'}};
		return {success: true, message: 'Verification code sent to ' + user.email};
	}catch(err){
		console.log(err);
		return {success: false, error: 'Unknown error'};
	}
}

const verifyforgotPasswordCode = User => async (email, code) => {
	//errors to handle: cover all, code expired, wrong code
	try{
		const user = (await User.find({email: email}))[0];
		const res = checkUserAndToken(user, code);
		return res;
	}catch(err){
		return {success: false, error: 'There was a problem'}
	}
}

const resetPassword = User => async (password, code, email) =>{
	//code expired or wrong code
	try{
		const user = (await User.find({email: email}))[0];
		if(!user){return {success: false, error: 'Email does not exist'}}
		let res = checkUserAndToken(user, code);
		if(!res.success){return res};
		await user.setPassword(password);
		myMailer.sendPasswordUpdatedVerification(user.email);
		return {success: true, message: 'Password was succesfully updated'};
	}catch(err){
		return {success: false, error: 'Unknown error'};
	}
}

const findFriends = User => async id => {
	try{
		const user = await User.findById(id);
		//algrorithm
		//1. Look for mutual friends
		//2. If school, find people that have the same school
		//3. Find people with same area codes
		

	}catch(err){
		return {success: false, error: 'Unknown error'}
	}
}

function checkUserAndToken(user, code){
	if(!user){return {success: false, error: 'Can not find user'}}
	if(!user.resetPasswordCode || !user.resetPasswordExpires){return {success: false, error: 'Code was not requested'}}
	if(!beforeTimeout(user.resetPasswordExpires)){return {success: false, error: 'Code expired'}};
	if(code !== user.resetPasswordCode){return {success: false, error: 'The code is not correct'}};
	return {success: true, message: 'You entered the correct code'};
}

function beforeTimeout(expiration){
	const now = new moment();
	return now.isBefore(moment(expiration));
}
const generatePasswordCode = async () =>{
	const SIZE = 2;
	const code = await crypto.randomBytes(SIZE);
	return code.toString('hex');
}
//End of password reset functions


const buildProfilePicturePath = userID =>{
	return 'users/' + userID + '/profilePic';
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
const errorCodes ={email: 0, phoneNumber: 1, username: 2,}
function getErrorCode(key){
	return errorCodes[key];
}


module.exports = User => {
	return {
		findById: BaseRequests.findById(User),
		size: BaseRequests.size(User),
		findMultiple: BaseRequests.findMultipleById(User),

		findFriends: findFriends(User),
		resetPassword: resetPassword(User),
		verifyforgotPasswordCode: verifyforgotPasswordCode(User),
		deleteAll: deleteAll(User),
		sendforgotPasswordEmail: sendforgotPasswordEmail(User),
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

