const async	  = require('async'),
	  aws 		= require('aws-sdk'),
	  BaseRequests = require('../BaseServiceRequests');

const s3 = new aws.S3(
	{
	 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

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

const toggleLike = Post => async (postID, userID, wasLiked) => {
	if(!userID || !postID){
		throw new Error('No user id or postID');
	}
	const post = await Post.findById(postID);
	if(post.likes.includes(userID)){
		post.likes.pull(userID);
	}else{
		post.likes.push(userID);
	}
	
	return await post.save();
}


const deleteById = Post => async (id, cb) =>{
	if(!id){
		throw new Error('No id supplied for post delete');
	}
	const post = await Post.findById(id);
	if(post.photos && post.photos.length>0){
		deleteImages(post.photos, async function(){
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
		await uploadImages(images, directory, async function(imgPaths){
			post.photos = imgPaths;
			await post.save();
			cb(post);
		});
	}else{
		cb(post);
	}
}

function deleteImages(imagePaths, cb){
	for(let i =0; i<imagePaths.length; i++){
		const params= {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: imagePaths[i],
		}
		s3.deleteObject(params, function(err, data){
			if(err){
				console.log(err)
			}else{
				console.log("File deleted");
				if(i===imagePaths.length-1){
					cb();
				}
			}
		})
	}
}

function uploadImages(images, directory, cb) {
	let ct =0;
	let returnArr =[];
	for(let i =0; i< images.length; i++){
		const image = images[i];
		var data = image.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer.from(data, 'base64');
		var path = directory + ct + '.jpg';
		ct++;
		returnArr.push(path);
		const params = {
	        Bucket: process.env.S3_BUCKET_NAME,
	        Key: path, // File name you want to save as in S3
	        Body: buf,
	        ACL:'public-read'
	    };
	    s3.upload(params, function(err, data){
	   		if(err){
	   			console.log(err);
	   		}else{
	   			console.log('FILE UPLAODED');
	   			if(i===images.length-1){
	   				cb(returnArr);
	   			}
	   		}
	   	});
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