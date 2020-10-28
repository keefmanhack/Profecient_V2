const BaseRequests = require('../../../../BaseServiceRequests');

const setLastLiker = PostBucket => async (id, userID) => {
	if(!id || !userID){
		throw new Error("Missing data to add a like to postBucket");
	}
	const bucket = await PostBucket.findById(id);
	bucket.lastLiker= userID;
	return await bucket.save();
}

// const removeALike = PostBucket => async (id, userID) => {
// 	if(!id || !userID){
// 		throw new Error("Missing data to remove a like to postBucket");
// 	}
// 	const bucket = await PostBucket.findById(id);
// 	bucket.newLikes.pop(userID);
// 	return await bucket.save();
// }

const setPostID = PostBucket => async (id, postID) => {
	if(!id || !postID){
		throw new Error('Missing data to set postID');
	}
	const postBucket = await PostBucket.findById(id);
	postBucket.postID = postID;
	return await postBucket.save();
}



module.exports = PostBucket => {
	return{
		setLastLiker: setLastLiker(PostBucket),
		setPostID: setPostID(PostBucket),

		create: BaseRequests.create(PostBucket),
		size: BaseRequests.size(PostBucket),
		deleteById: BaseRequests.deleteById(PostBucket),
		findById: BaseRequests.findById(PostBucket),
	}
}