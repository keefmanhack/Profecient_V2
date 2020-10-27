const PostService = require('../../../Post/index');
const PostBucketService = require('../../../Notification/Relations/PostBucket/index');
const NotificationService = require('../../../Notification/index');
const UserService = require('../../../User/index');
const User = require('../../../User/index');

class PostHandler{
	static async toggleLiked(postID, userMayHaveLikedID){
		if(!postID || !userMayHaveLikedID){
			throw new Error("Missing data for liking a post");
		}
		const postWasLiked =  await PostService.toggleLike(userMayHaveLikedID, postID);

		const foundPost = await PostService.findById(postID);
		const author = await UserService.findById(foundPost.author._id);

		let bucket;
		if(postWasLiked){
			bucket = await PostBucketService.addNewLike(foundPost.notifBucketID, userMayHaveLikedID);

			author.notifications.relations.unDismissed++;
		}else{
			bucket = await PostBucketService.removeALike(foundPost.notifBucketID, userMayHaveLikedID);
			author.notifications.relations.unDismissed--;
		}
		await NotificationService.sendItemToFront(author.notifications.relations.notifs, bucket._id)
		await author.save();
		return postWasLiked;
	}

	static async generateNewPostWithNotifBucket(text, userID, images, cb){
		if(!text || !userID){
			throw new Error("Missing data to generate a post");
		}

		const newPostNotifBucket = await PostBucketService.create();
		const user = await UserService.findById(userID);
		PostService.create(text, userID, images, newPostNotifBucket._id, async function(newPost){
			newPostNotifBucket.postID = newPost._id;
			await newPostNotifBucket.save();

			await NotificationService.insertItem(user.notifications.relations.notifs, newPostNotifBucket);

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
		await NotificationService.removeItem(user.notifications.relations.notifs, post.notifBucketID);

		user.posts.pull(postID);
		await user.save();
		await PostBucketService.deleteById(post.notifBucketID);
		PostService.deleteById(postID, function(){
			cb();
		})
	}
}

module.exports = PostHandler;