const async	  = require('async'),
	  aws 		= require('aws-sdk');

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

const toggleLike = Post => async (userID, postID) => {
	if(!userID || !postID){
		throw new Error('No user id or postID');
	}
	const post = await Post.findById(postID);
	if(post.likes.includes(userID)){
		post.likes.pop(userID);
	}else{
		post.likes.push(userID);
	}
	await post.save();
}

const findById = Post => async id => {
	if(!id){
		throw new Error('No id for post');
	}
	return await Post.findById(id);
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

const create = Post => async (text, authorID, images, cb) => {
	if(!text || !authorID){
		throw new Error('No text or authorID');
	}
	const postStruct = {
		text: text,
		author: authorID
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

module.exports = Post => {
	return {
		findMutlipleByAuthor: findMutlipleByAuthor(Post),
		findMultiple: findMultiple(Post),
		toggleLike: toggleLike(Post),
		findById: findById(Post),
		create: create(Post),
		deleteById: deleteById(Post),
	}
}