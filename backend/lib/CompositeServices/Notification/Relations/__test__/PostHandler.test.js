const PostHandler = require('../PostHandler');
const mongoose_tester = require('../../../../../mongoose_test_config.js');
// mongoose_tester.set('debug', true);

const UserService = require('../../../../User/index');
const NotificationService = require('../../../../Notification/index');
const PostBucketService = require('../../../../Notification/Categories/Relations/PostBucket/index');


const users = require('../../../../testUsers');

require('dotenv').config();

describe('Creates a new post notification bucket when user creates a post', () =>{
    let user1, user2, post1, post2;
	beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        user1 = await UserService.create(users[0]);
        user2 = await UserService.create(users[1]);
		done();
	})

	afterAll(async done => {
        await mongoose_tester.connection.close();

        await PostBucketService.deleteById(post1.notifBucketID);
        await PostBucketService.deleteById(post2.notifBucketID);
        await PostService.deleteById(post1._id,  ()=>{});
        await PostService.deleteById(post2._id,  ()=>{});
        await UserService.deleteById(user1._id);
        await UserService.deleteById(user2._id);

		done();
	})

	it('Can create a new post notification bucket and link to the users post', async done => {
        //setup
        PostHandler.createNewPost('Created post', user1._id, null, async newPost => {
            user1 = await UserService.findById(user1._id);
            const relNotifications = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
            post1=newPost;
            //test
            expect(relNotifications.list.length).toEqual(1);
            expect(relNotifications.list[0].onModel).toEqual("PostBucket");
            expect(newPost.text).toEqual('Created post');
            expect(newPost.notifBucketID).toEqual(relNotifications.list[0].to._id);
            expect(newPost._id).toEqual(relNotifications.list[0].to.postID);

            done();
        })
    })
    
    it('Can move a notification to front of bucket when a user likes a post', async done => {
        //setup
        PostHandler.createNewPost('2nd post', user1._id, null, async newPost => {
            let relNotifications = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
            post2 = newPost;
            //intermediate test
            expect(relNotifications.list[0].to._id).toEqual(post2.notifBucketID);

            await PostHandler.toggleLiked(post1._id, user2._id, true);
            relNotifications =await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
            user1 = await UserService.findById(user1._id);

            //test
            expect(relNotifications.list.length).toEqual(2);
            expect(relNotifications.list[0].to._id).toEqual(post1.notifBucketID);
            expect(relNotifications.list[0].to.lastLiker).toEqual(user2._id);
            expect(user1.notifications.relations.unDismissed).toEqual(1);
            done();
        })
    })

})

// describe('Deletes a post notification bucket from a user when  post is deleted', () =>{
// 	beforeAll(async done => {
// 		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
// 		done();
// 	})

// 	afterAll(async done => {
// 		await mongoose_tester.connection.close();
// 		done();
// 	})

// 	it('Can delete the post and the post notification bucket', async done => {
// 		let user1 = await UserService.create(users[0]);
// 		PostHandler.generateNewPostWithNotifBucket("This post will be deleted", user1._id, null, async function(newPost){
// 			PostHandler.deletePostAndNotifBucket(newPost._id, user1._id, async function(){
// 				user1 = await UserService.findById(user1._id);
// 				const relNotifs = await NotificationService.findById(user1.notifications.relations.notifBucket);

// 				expect(relNotifs.list.length).toEqual(0);
// 				expect(user1.posts.length).toEqual(0);
// 				expect(await PostBucketService.size()).toEqual(0);

// 				await NotificationService.deleteById(user1.notifications.relations.notifBucket);
// 				await UserService.deleteById(user1._id);

// 				done();
// 			})
// 		});
// 	})

// })

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
// 		PostHandler.deletePostAndNotifBucket(post._id, user1._id, async () => {
// 			await mongoose_tester.connection.close();
// 			done();
// 		})
// 		await NotificationService.deleteById(user1.notifications.relations.notifBucket);
// 		await NotificationService.deleteById(user2.notifications.relations.notifBucket);
// 		await NotificationService.deleteById(user3.notifications.relations.notifBucket);
// 		await UserService.deleteById(user1._id);
// 		await UserService.deleteById(user2._id);
// 		await UserService.deleteById(user3._id);
// 	})

// 	it('Can add a notification that a post was liked', async () => {
// 		const wasLiked = await PostHandler.toggleLiked(post._id, user2._id);

// 		post = await PostService.findById(post._id);
// 		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 		user1 = await UserService.findById(user1._id);
// 		const relNotifs = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);

// 		expect(wasLiked).toEqual(true);
// 		expect(post.likes[0]).toEqual(user2._id);
// 		expect(postBucketNotif.newLikes[0]).toEqual(user2._id);
// 		expect(relNotifs.pop()).toEqual(postBucketNotif);
// 	})

// 	// it('Can remove a notification if a post was unliked', async () => {
// 	// 	const wasLiked = await PostHandler.toggleLiked(post._id, user2._id);

// 	// 	post = await PostService.findById(post._id);
// 	// 	const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 	// 	user1 = await UserService.findById(user1._id);

// 	// 	expect(wasLiked).toEqual(false);
// 	// 	expect(post.likes.length).toEqual(0);
// 	// 	expect(postBucketNotif.newLikes.length).toEqual(0);
// 	// 	expect(user1.notifications.relations.unDismissed).toEqual(0);
// 	// })

// 	// it('Can handle multiple notification likes', async () => {
// 	// 	await PostHandler.toggleLiked(post._id, user2._id);
// 	// 	await PostHandler.toggleLiked(post._id, user3._id);

// 	// 	post = await PostService.findById(post._id);
// 	// 	const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 	// 	user1 = await UserService.findById(user1._id);

// 	// 	expect(post.likes.length).toEqual(2);
// 	// 	expect(postBucketNotif.newLikes[0]).toEqual(user2._id);
// 	// 	expect(postBucketNotif.newLikes[1]).toEqual(user3._id);
// 	// 	expect(postBucketNotif.newLikes.length).toEqual(2);
// 	// 	expect(user1.notifications.relations.unDismissed).toEqual(2);
// 	// })

// 	// it('Can delete multiple notification likes', async () => {
// 	// 	await PostHandler.toggleLiked(post._id, user2._id);
// 	// 	await PostHandler.toggleLiked(post._id, user3._id);

// 	// 	post = await PostService.findById(post._id);
// 	// 	const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
// 	// 	user1 = await UserService.findById(user1._id);

// 	// 	expect(post.likes.length).toEqual(0);
// 	// 	expect(postBucketNotif.newLikes.length).toEqual(0);
// 	// 	expect(user1.notifications.relations.unDismissed).toEqual(0);
// 	// })

// })