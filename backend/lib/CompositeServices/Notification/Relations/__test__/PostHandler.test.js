const PostHandler = require('../PostHandler');
const mongoose_tester = require('../../../../../mongoose_test_config.js');
// mongoose_tester.set('debug', true);

const UserService = require('../../../../User/index');
const NotificationService = require('../../../../Notification/index');
const PostBucketService = require('../../../../Notification/Categories/Relations/PostBucket/index');
const PostService = require('../../../../Post/index');

const userGen = require('../../../../Testing Data/testUserGenerator');

require('dotenv').config();

describe('Creates a new post notification bucket when user creates a post', () =>{
    let user1, user2, post1, post2;
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		UserService.create(userGen(), res => {
			user1 = res.user;
			UserService.create(userGen(), res => {
				user2 = res.user;
				done();
			})
		})
		
	})

	afterAll(async done => {
        await PostBucketService.deleteById(post1.notifBucketID);
        await PostBucketService.deleteById(post2.notifBucketID);
        await PostService.deleteById(post1._id,  ()=>{});
		await PostService.deleteById(post2._id,  ()=>{});
		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
        

        await mongoose_tester.connection.close();
		done();
	})

	it('Can create a new post notification bucket and link to the users post', async done => {
        //setup
        PostHandler.createNewPost('Created post', user1._id, null, async newPost => {
            user1 = await UserService.findById(user1._id);
            const relNotifications = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
            post1=newPost;
            //test
            // expect(relNotifications.list.length).toEqual(1);
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

            await PostHandler.toggleLiked(user1._id, post1._id, user2._id);
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

describe('Deletes a post notification bucket from a user when  post is deleted', () =>{
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		UserService.create(userGen(), res => {
			user1 = res.user;
			done();
		})
	})

	afterAll(async done => {
		
		await mongoose_tester.connection.close();
		done();
	})

	it('Can delete the post and the post notification bucket', async done => {
		PostHandler.createNewPost("This post will be deleted", user1._id, null, async function(newPost){
			PostHandler.deletePost(newPost._id, user1._id, async function(){
				user1 = await UserService.findById(user1._id);
				const relNotifs = await NotificationService.findById(user1.notifications.relations.notifBucket);

				expect(relNotifs.list.length).toEqual(0);
				expect(user1.posts.length).toEqual(0);
				// expect(await PostBucketService.size()).toEqual(0);

				await NotificationService.deleteById(user1.notifications.relations.notifBucket);

				done();
			})
		});
	})
})

describe('Notifications on post likes and comments', () =>{
	let user1, user2, user3, post;
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		UserService.create(userGen(), res=>{
			user1=res.user;
			UserService.create(userGen(), res=>{
				user2=res.user;
				UserService.create(userGen(), res=>{
					user3=res.user;
					PostHandler.createNewPost("Test notifications of likes and comments", user1._id, null, newPost =>{
						post=newPost;
						done();
					})
				})
			})
		})
	})

	afterAll(async done => {
		await NotificationService.deleteById(user1.notifications.relations.notifBucket);
		await NotificationService.deleteById(user2.notifications.relations.notifBucket);
		await NotificationService.deleteById(user3.notifications.relations.notifBucket);
		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
		await UserService.deleteById(user3._id);

		await mongoose_tester.connection.close();
		done();
	})

	it('Can add a notification that a post was liked', async () => {
		post = await PostHandler.toggleLiked(user1._id, post._id, user2._id);

		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
		user1 = await UserService.findById(user1._id);
		const relNotifs = await NotificationService.findById(user1.notifications.relations.notifBucket);

        expect(post.likes.length).toEqual(1);
		expect(post.likes[0]).toEqual(user2._id);
		expect(postBucketNotif.lastLiker).toEqual(user2._id);
		expect(relNotifs.list.pop().to).toEqual(postBucketNotif._id);
	})


	it('Can handle multiple notification likes', async () => {
		await PostHandler.toggleLiked(user1._id, post._id, user2._id);
		post = await PostHandler.toggleLiked(user1._id, post._id, user3._id);
		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
		user1 = await UserService.findById(user1._id);

		expect(post.likes.length).toEqual(1);
		expect(postBucketNotif.lastLiker).toEqual(user3._id);
		expect(user1.notifications.relations.unDismissed).toEqual(1);
    })

    it('Can add a notification that a post was commented on', async () => {
		post = await PostHandler.createNewComment(user1._id, post._id, {author: user2._id, text: 'Comment text'});
        const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
        user1 = await UserService.findById(user1._id);
        
        expect(user1.notifications.relations.unDismissed).toEqual(2);
        expect(postBucketNotif.lastComment._id).toEqual(post.comments.pop()._id);
    })


	it('Can handle multiple notification comments', async () => {
		const prevUnDimissedCt = user1.notifications.relations.unDismissed;
		post = await PostHandler.createNewComment(user1._id, post._id, {author: user3._id, text: '2nd Comment text'});
		const postBucketNotif = await PostBucketService.findById(post.notifBucketID);
		user1 = await UserService.findById(user1._id);

		expect(user1.notifications.relations.unDismissed).toEqual(prevUnDimissedCt + 1);
		expect(postBucketNotif.lastComment._id).toEqual(post.comments.pop()._id);
    })
    
    it('Can set notification liker and commentor to null when notification is dismissed', async () => {
		const prevUnDimissedCt = user1.notifications.relations.unDismissed;
		await PostHandler.removeNotification(user1._id, post.notifBucketID);
        const postBucket = await PostBucketService.findById(post.notifBucketID);
        user1 = await UserService.findById(user1._id);

        expect(postBucket.lastLiker).toEqual(null);
        expect(postBucket.lastComment).toEqual(null);
        expect(user1.notifications.relations.unDismissed).toEqual(0);
    })

	it('Removes notifications if a post is deleted', async done => {
		post=await PostHandler.toggleLiked(user1._id, post._id, user2._id);
		user1 = await UserService.findById(user1._id);
		expect(user1.notifications.relations.unDismissed).toEqual(1);

		PostHandler.deletePost(post._id, user1._id, async () => {
			user1 = await UserService.findById(user1._id);
			expect(user1.notifications.relations.unDismissed).toEqual(0);
			
			done();
		})
	})

})