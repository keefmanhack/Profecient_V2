const BaseRequests = require('../../../BaseServiceRequests');

const addNewLike = PostBucket => async (id, userID) => {
	if(!id || !userID){
		throw new Error("Missing data to add a like to postBucket");
	}
	const bucket = await PostBucket.findById(id);
	bucket.newLikes.push(userID);
	return await bucket.save();
}

const removeALike = PostBucket => async (id, userID) => {
	if(!id || !userID){
		throw new Error("Missing data to remove a like to postBucket");
	}
	const bucket = await PostBucket.findById(id);
	bucket.newLikes.pop(userID);
	return await bucket.save();
}



module.exports = PostBucket => {
	return{
		addNewLike: addNewLike(PostBucket),
		removeALike: removeALike(PostBucket),

		create: BaseRequests.create(PostBucket),
		size: BaseRequests.size(PostBucket),
		deleteById: BaseRequests.deleteById(PostBucket),
		findById: BaseRequests.findById(PostBucket),
	}
}