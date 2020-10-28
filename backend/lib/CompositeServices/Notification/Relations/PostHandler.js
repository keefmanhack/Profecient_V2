const PostService = require('../../../Post/index');
const PostBucketService = require('../../../Notification/Categories/Relations/PostBucket/index');
const NotificationService = require('../../../Notification/index');
const UserService = require('../../../User/index');
const User = require('../../../User/index');

class PostHandler{
	static async toggleLiked(postID, toggledUserID, wasLiked){
		if(!postID || !toggledUserID || !wasLiked){
			throw new Error('Missing data to toggle like on post');
		}
		const post = await PostService.toggleLike(postID, toggledUserID, wasLiked);
		if(wasLiked){
			const postBucket = await PostBucketService.setLastLiker(post.notifBucketID, toggledUserID);
			const author = await UserService.findById(post.author);
			await NotificationService.sendItemToFrontByTo(author.notifications.relations.notifBucket, postBucket._id);
		}else{
			if(post.likes.length>=1){
				await PostBucketService.setLastLiker(post.notifBucketID, post.likes[post.likes.length-1]);
			}else{
				await PostBucketService.setLastLiker(post.notifBucketID, null);
			}
		}
		return post;
	}

	static async createNewPost(text, userID, images, cb){
		if(!text || !userID){
			throw new Error("Missing data to generate a post");
		}
		const newPostNotifBucket = await PostBucketService.create();
		PostService.create(text, userID, images, newPostNotifBucket._id, async function(newPost){
			const newBucket = await PostBucketService.setPostID(newPostNotifBucket._id, newPost._id);
			const user = await UserService.insertNewPost(userID, newPost._id);
			await NotificationService.insertItem(user.notifications.relations.notifBucket, newBucket);
			cb(newPost);
		})
	}

	static async deletePostAndNotifBucket(postID, userID, cb){
		if(!postID){
			throw new Error("No postID to remove a post");
		}

		const post = await PostService.findById(postID);
		const user = await UserService.findById(userID);
		await NotificationService.removeItemByToId(user.notifications.relations.notifBucket, post.notifBucketID);

		user.posts.pull(postID);
		await user.save();
		await PostBucketService.deleteById(post.notifBucketID);
		PostService.deleteById(postID, function(){
			cb();
		})
	}
}

module.exports = PostHandler;