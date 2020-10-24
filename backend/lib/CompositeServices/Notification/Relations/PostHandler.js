const PostService = require('../../../Post/index');
const PostBucketService = require('../../../Notification/Relations/PostBucket/index');
const UserService = require('../../../User/index');

class PostHandler{
	static async generateNewPostWithNotifBucket(text, userID, images, cb){
		if(!text || !userID){
			throw new Error("Missing data to generate a post");
		}


		const newPostNotifBucket = await PostBucketService.create();
		const user = await UserService.findById(userID);
		user.notifications.relations.postBuckets.push({bucket: newPostNotifBucket});
		PostService.create(text, userID, images, newPostNotifBucket._id, async function(newPost){
			newPostNotifBucket.postID = newPost._id;
			await newPostNotifBucket.save();

			user.posts.unshift(newPost);
			await user.save();
			cb(newPost);
		})
	}

	static async deletePostAndNotifBucket(postID, userID, cb){
		if(!postID){
			throw new Error("No postID to remove a post");
		}

		const post = await PostService.findById(postID);
		const user = await UserService.findById(userID);
		for(let i = 0; i<user.notifications.relations.postBuckets.length; i++){
			const postBucket = user.notifications.relations.postBuckets[i];
			if(postBucket.bucket + "" === post.notifBucketID + ""){
				user.notifications.relations.postBuckets.pop(i);
			}
		}

		user.posts.pull(postID);
		await user.save();
		await PostBucketService.deleteById(post.notifBucketID);
		PostService.deleteById(postID, function(){
			cb();
		})


	}
}

module.exports = PostHandler;