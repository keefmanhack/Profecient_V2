const mongoose_tester = require('../../../mongoose_test_config');

const FriendHandler = require('./Relations/FriendHandler');
const UserService = require('../../User/index');
const NotificationService = require('../../Notification/index');
const Formatter = require('../../Notification/Formatter/formatter');
const relFormatMap = require('../../Notification/Formatter/RelationsFormatter/formatMap');
const NotificationHandler = require('./NotificationHandler');

// const users = require('../../Testing Data/testUsers');
const userGen = require('../../Testing Data/testUserGenerator');

require('dotenv').config();

describe('Creates new notification when a user followers another user', () =>{
	let user1, user2, notifID;
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		UserService.create(userGen(), async res => {
			user1 = res.user;

			UserService.create(userGen(), async res => {
				user2 = res.user;

				//create multiple notifications
				await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
				await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
				await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);

				user2 = await UserService.findById(user2._id);
				let temp = await NotificationService.findById(user2.notifications.relations.notifBucket)
				notifID = temp.list.pop().to;
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


	it('Properly handles the removal of new folower notifications', async done => {
        await NotificationHandler.removeRelationNotifById(user2._id, notifID);
        const notifs = await NotificationService.findByIdAndPopulateList(user2.notifications.relations.notifBucket);

        expect(notifs.list.length).toEqual(2);
        done();
	})

})