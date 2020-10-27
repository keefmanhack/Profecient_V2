const PostHandler = require('../PostHandler');
const mongoose_tester = require('../../../../../mongoose_test_config.js');
// mongoose_tester.set('debug', true);

const UserService = require('../../../../User/index');
const PostService = require('../../../../Post/index');
const PostBucketService = require('../../../../Notification/Relations/PostBucket/index');
const NotificationService = require('../../../../Notification/index');

const users = require('../../../../testUsers');

require('dotenv').config();

describe('Creates a new post notification bucket when user creates a post', () =>{
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		done();
	})

	afterAll(async done => {
		await mongoose_tester.connection.close();
		done();
	})

	it('Can create a new post notification bucket and link to the users post', async done => {
		let user1 = await UserService.create(users[0]);
		await PostHandler.generateNewPostWithNotifBucket("This is my post", user1._id, null, async function(newPost){
			user1 = await UserService.findById(user1._id);
			const relNotifs = await NotificationService.findById(user1.notifications.relations.notifBucket);
			expect(relNotifs.list.length).toEqual(1);
			
			const lastNotif = relNotifs.list.pop();
			expect(newPost.notifBucketID).toEqual(lastNotif.to);
			expect(lastNotif.onModel).toEqual('PostBucket');
			expect(newPost.text).toEqual("This is my post");

			await NotificationService.deleteById(user1.notifications.relations.notifBucket);
			await PostBucketService.deleteById(lastNotif.to);
			await PostService.deleteById(newPost._id, ()=>{});
			await UserService.deleteById(user1._id);

			expect(await NotificationService.size()).toEqual(0);
			expect(await PostBucketService.size()).toEqual(0);
			expect(await PostService.size()).toEqual(0);
			expect(await UserService.size()).toEqual(0);


			done();
		});
	})

})

describe('Deletes a post notification bucket from a user when  post is deleted', () =>{
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		done();
	})

	afterAll(async done => {
		await mongoose_tester.connection.close();
		done();
	})

	it('Can delete the post and the post notification bucket', async done => {
		let user1 = await UserService.create(users[0]);
		PostHandler.generateNewPostWithNotifBucket("This post will be deleted", user1._id, null, async function(newPost){
			PostHandler.deletePostAndNotifBucket(newPost._id, user1._id, async function(){
				user1 = await UserService.findById(user1._id);
				const relNotifs = await NotificationService.findById(user1.notifications.relations.notifBucket);

				expect(relNotifs.list.length).toEqual(0);
				expect(user1.posts.length).toEqual(0);
				expect(await PostBucketService.size()).toEqual(0);

				await NotificationService.deleteById(user1.notifications.relations.notifBucket);
				await UserService.deleteById(user1._id);

				done();
			})
		});
	})

})

// describe('Notifications on post likes, and comments', () =>{
// 	let user1;
// 	let user2;
// 	let user3;
// 	let post;
// 	beforeAll(async done => {
// 		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
// 		user1 = await UserService.create(users[0]);
// 		user2 = await UserService.create(users[1]);
// 		user3 = await UserService.create(users[2]);
// 		PostHandler.generateNewPostWithNotifBucket("Test notifications of likes and comments", user1._id, null, newPost =>{
// 			post=newPost;
// 			done();
// 		})
// 	})

// 	afterAll(async done => {
// 		await UserService.deleteById(user1._id);
// 		await UserService.deleteById(user2._id);
// 		await UserService.deleteById(user3._id);
// 		await PostService.deleteById(post._id, () => {});

// 		await mongoose_tester.connection.close();
// 		done();
// 	})

// 	it('Can add a notification that a post was liked', async () => {
// 		const wasLiked = await PostHandler.toggleLiked(post._id, user2._id);

// 		post = await PostService.findById(post._id);
// 		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 		user1 = await UserService.findById(user1._id);
// 		const lastNotif = await NotificationService.findById(user1.notifications.relations.postBucket)

// 		expect(wasLiked).toEqual(true);
// 		expect(post.likes[0]).toEqual(user2._id);
// 		expect(postBucketNotif.newLikes[0]).toEqual(user2._id);
// 		expect(user1.notifications.relations.unDismissed).toEqual(1);
// 	})

// 	it('Can remove a notification if a post was unliked', async () => {
// 		const wasLiked = await PostHandler.toggleLiked(post._id, user2._id);

// 		post = await PostService.findById(post._id);
// 		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 		user1 = await UserService.findById(user1._id);

// 		expect(wasLiked).toEqual(false);
// 		expect(post.likes.length).toEqual(0);
// 		expect(postBucketNotif.newLikes.length).toEqual(0);
// 		expect(user1.notifications.relations.unDismissed).toEqual(0);
// 	})

// 	it('Can handle multiple notification likes', async () => {
// 		await PostHandler.toggleLiked(post._id, user2._id);
// 		await PostHandler.toggleLiked(post._id, user3._id);

// 		post = await PostService.findById(post._id);
// 		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 		user1 = await UserService.findById(user1._id);

// 		expect(post.likes.length).toEqual(2);
// 		expect(postBucketNotif.newLikes[0]).toEqual(user2._id);
// 		expect(postBucketNotif.newLikes[1]).toEqual(user3._id);
// 		expect(postBucketNotif.newLikes.length).toEqual(2);
// 		expect(user1.notifications.relations.unDismissed).toEqual(2);
// 	})

// 	it('Can delete multiple notification likes', async () => {
// 		await PostHandler.toggleLiked(post._id, user2._id);
// 		await PostHandler.toggleLiked(post._id, user3._id);

// 		post = await PostService.findById(post._id);
// 		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 		user1 = await UserService.findById(user1._id);

// 		expect(post.likes.length).toEqual(0);
// 		expect(postBucketNotif.newLikes.length).toEqual(0);
// 		expect(user1.notifications.relations.unDismissed).toEqual(0);
// 	})

// })