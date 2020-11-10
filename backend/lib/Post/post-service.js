const BaseRequests = require('../BaseServiceRequests');
const imageServices = require('../S3/ImageService');

const findMutlipleByAuthor = Post => async ids =>{
	if(!ids){
		throw new Error('No ids for posts');
	}
	return await Post.find({author: ids}).sort('-date').populate('author');
}

const findMultiple = Post => async ids => {
	if(!ids){
		throw new Error('No ids for posts');
	}
	return await Post.find({_id: ids}).sort('-date').populate('author');
}

const toggleLike = Post => async (postID, userID) => {
	if(!userID || !postID){
		throw new Error('No user id or postID');
	}
	let wasLiked = false;
	const post = await Post.findById(postID);
	if(post.likes.includes(userID)){
		post.likes.pull(userID);
	}else{
		post.likes.push(userID);
		wasLiked=true;
	}
	await post.save();
	return wasLiked;
}


const deleteById = Post => async (id, cb) =>{
	if(!id){
		throw new Error('No id supplied for post delete');
	}
	const post = await Post.findById(id);
	if(post.photos && post.photos.length>0){
		imageServices.deleteImages(post.photos, async function(){
			await Post.findByIdAndRemove(id);
			cb();
		});
	}else{
		await Post.findByIdAndRemove(id);
		cb();
	}
}

const create = Post => async (text, authorID, images, notifBucketID, cb) => {
	if(!text || !authorID){
		throw new Error('No text or authorID');
	}
	const postStruct = {
		text: text,
		author: authorID,
		notifBucketID: notifBucketID
	}
	let post = await Post.create(postStruct);

	let imgPaths = [];
	if(images){
		const directory = 'users/' + authorID + '/posts/' + post._id +'/';
		if(!Array.isArray(images)){ //convert to array so it works with eachSeries
			images = [images];
		}
		imageServices.uploadImages(images, directory, async function(imgPaths){
			post.photos = imgPaths;
			await post.save();
			cb(post);
		});
	}else{
		cb(post);
	}
}

const addNewComment = Post => async (id, comment) => {
	if(!id || !comment){
		throw new Error('Missing data to add a new comment');
	}
	const post = await Post.findById(id);
	post.comments.push(comment);
	return await post.save();
}

module.exports = Post => {
	return {
		findById: BaseRequests.findById(Post),
		size: BaseRequests.size(Post),

		findMutlipleByAuthor: findMutlipleByAuthor(Post),
		findMultiple: findMultiple(Post),
		toggleLike: toggleLike(Post),
		create: create(Post),
		deleteById: deleteById(Post),
		addNewComment: addNewComment(Post),
	}
}