const PostBucket = require('.');
const BaseRequests = require('../../../../BaseServiceRequests');

const setLastLiker = PostBucket => async (id, userID) => {
	if(!id){
		throw new Error("Missing data to add a like to postBucket");
	}
	const bucket = await PostBucket.findById(id);
	bucket.lastLiker= userID;
	bucket.timeStamp = new Date();
	return await bucket.save();
}

const setPostID = PostBucket => async (id, postID) => {
	if(!id || !postID){
		throw new Error('Missing data to set postID');
	}
	const postBucket = await PostBucket.findById(id);
	postBucket.postID = postID;
	return await postBucket.save();
}

const setLikerAndCommentToNull = PostBucket => async id => {
	if(!id){
		throw new Error('Missing id to set liker and comment to null');
	}
	const bucket = await PostBucket.findById(id);
	bucket.lastLiker = null;
	bucket.lastComment = null;
	return await bucket.save();
}

const setLastCommenter = PostBucket => async (id, commentID) => {
	if(!id || !commentID){
		throw new Error('Missing data to set last commenter')
	}
	const bucket = await PostBucket.findById(id);
	bucket.lastComment = commentID;
	bucket.timeStamp = new Date();
	return await bucket.save();
}



module.exports = PostBucket => {
	return{
		setLastLiker: setLastLiker(PostBucket),
		setPostID: setPostID(PostBucket),
		setLikerAndCommentToNull: setLikerAndCommentToNull(PostBucket),
		setLastCommenter: setLastCommenter(PostBucket),

		create: BaseRequests.create(PostBucket),
		size: BaseRequests.size(PostBucket),
		deleteById: BaseRequests.deleteById(PostBucket),
		findById: BaseRequests.findById(PostBucket),
	}
}