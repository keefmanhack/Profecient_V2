const PostHandler = require('../PostHandler');
const mongoose_tester = require('../../../../../mongoose_test_config.js');

const UserService = require('../../../../User/index');
const PostService = require('../../../../Post/index');
const PostBucketService = require('../../../../Notification/Relations/PostBucket/index');

const users = require('./testUsers');

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
			expect(user1.notifications.relations.postBuckets.length).toEqual(1);

			const lastBucket = user1.notifications.relations.postBuckets.pop();
			expect(newPost.notifBucketID).toEqual(lastBucket.bucket);
			expect(newPost.text).toEqual("This is my post");

			await PostBucketService.deleteById(lastBucket.bucket);
			await PostService.deleteById(newPost._id, ()=>{});
			await UserService.deleteById(user1._id);


			expect(await PostBucketService.size()).toEqual(0);
			expect(await UserService.size()).toEqual(0);
			expect(await PostService.size()).toEqual(0);


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
		await PostHandler.generateNewPostWithNotifBucket("This is my post", user1._id, null, async function(newPost){
			await PostHandler.deletePostAndNotifBucket(newPost._id, user1._id, async function(){
				user1 = await UserService.findById(user1._id);
				expect(user1.notifications.relations.postBuckets.length).toEqual(0);
				expect(user1.posts.length).toEqual(0);

				await UserService.deleteById(user1._id);

				expect(await PostBucketService.size()).toEqual(0);
				expect(await UserService.size()).toEqual(0);
				expect(await PostService.size()).toEqual(0);
				
				done();
			})
		});
	})

})