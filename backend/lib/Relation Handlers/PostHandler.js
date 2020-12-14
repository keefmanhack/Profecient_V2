const PostService = require('../Post/index');
const PostBucketService = require('../Notification/Categories/Relations/PostBucket/index');
const NotificationService = require('../Notification/index');
const UserService = require('../User/index');
const CommentService = require('../Comment/index');


class PostHandler{
	static async toggleLiked(userID, postID, toggledUserID){
		if(!postID || !toggledUserID){
			throw new Error('Missing data to toggle like on post');
		}
		const wasLiked = await PostService.toggleLike(postID, toggledUserID);
		const post = await PostService.findById(postID);
		if(wasLiked){
			const postBucket = await PostBucketService.setLastLiker(post.notifBucketID, toggledUserID);
			const author = await UserService.incrementNotifCt(userID, UserService.notifCategories.relation);
			await NotificationService.sendItemToFrontByTo(author.notifications.relations.notifBucket, postBucket._id);
		}else{
			await UserService.decrementNotifCt(userID, UserService.notifCategories.relation);
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

	static async deletePost(postID, userID, cb){
		if(!postID){
			throw new Error("No postID to remove a post");
		}

		const post = await PostService.findById(postID);
		const user = await UserService.subtractRelationNotifCT(userID, post.likes.length + post.comments.length);
		await NotificationService.removeItemByToId(user.notifications.relations.notifBucket, post.notifBucketID);

		user.posts.pull(postID);
		await user.save();
		await PostBucketService.deleteById(post.notifBucketID);
		PostService.deleteById(postID, function(){
			cb();
		})
	}

	static async removeNotification(userID, notifID){
		const bucket = await PostBucketService.setLikerAndCommentToNull(notifID);
		const post = await PostService.findById(bucket.postID);
		await UserService.subtractRelationNotifCT(userID, (post.likes.length + post.comments.length));
	}

	static async createNewComment(userID, postID, commentData){
		const newComment = await CommentService.create(commentData);
		let updatedPost = await PostService.addNewComment(postID, newComment);
		const postBucket = await PostBucketService.setLastCommenter(updatedPost.notifBucketID, newComment._id);

		const user1 = await UserService.incrementNotifCt(userID, UserService.notifCategories.relation);
		await NotificationService.sendItemToFrontByTo(user1.notifications.relations.notifBucket, postBucket._id);
		return updatedPost;
	}
}

module.exports = PostHandler;