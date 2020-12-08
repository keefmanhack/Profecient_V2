const FriendHandler = require('../FriendHandler');
const mongoose_tester = require('../../../../../mongoose_test_config.js');
const NewFollowerService = require('../../../../Notification/Categories/Relations/New Follower/index');
const NotificationService = require('../../../../Notification/index');

const UserService = require('../../../../User/index');

const userGen = require('../../../../Testing Data/testUserGenerator');

require('dotenv').config();

describe('Creates new notification when a user followers another user', () =>{
	let user1, user2;
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
		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
		await mongoose_tester.connection.close();
		done();
	})


	it('One user can create a new follower Notification for another user', async () => {
		//setup
		const newNotif = await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		user2= await UserService.findById(user2._id);
		const relNotifs = await NotificationService.findByIdAndPopulateList(user2.notifications.relations.notifBucket);

		//test
		expect(user2.notifications.relations.unDismissed).toEqual(1);
		expect(relNotifs.list.length).toEqual(1);
		expect(relNotifs.list[0].to.followerID).toEqual(user1._id);
	})

	it('Can remove a new follower Notification for a user', async () => {
		//setup
		let relNotifs = await NotificationService.findById(user2.notifications.relations.notifBucket);
		await FriendHandler.removeNotification(user2._id, relNotifs.list[0].to);
		user2 = await UserService.findById(user2._id);
		relNotifs = await NotificationService.findById(user2.notifications.relations.notifBucket);

		//test
		expect(user2.notifications.relations.unDismissed).toEqual(0);
		expect(relNotifs.list.length).toEqual(0);
		// expect(await NewFollowerService.size()).toEqual(0);
	})
})