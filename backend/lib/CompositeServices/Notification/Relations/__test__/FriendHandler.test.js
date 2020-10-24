const FriendHandler = require('../FriendHandler');
const mongoose_tester = require('../../../../../mongoose_test_config.js');
const NewFollowerNotifService = require('../../../../Notification/Relations/New Follower/index');

const UserService = require('../../../../User/index');

const users = require('./testUsers');

require('dotenv').config();

describe('Creates new notification when a user followers another user', () =>{
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		done();
	})

	afterAll(async done => {
		await mongoose_tester.connection.close();
		done();
	})


	it('One user can create a new follower Notification for another user', async () => {
		const user1 = await UserService.create(users[0]);
		let user2 = await UserService.create(users[1]);
		const user2RelationUnDismissedCt = user2.notifications.relations.unDismissed;

		const knownNotif = await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		user2 = await UserService.findById(user2._id);

		const lastNotifIndex = user2.notifications.relations.newFollowerNote.length-1;
		const expectedNotif = await NewFollowerNotifService.findById(user2.notifications.relations.newFollowerNote[lastNotifIndex]);
		
		expect(user2.notifications.relations.unDismissed).toEqual(user2RelationUnDismissedCt+1);
		expect(expectedNotif._id).toEqual(knownNotif._id);
		expect(expectedNotif.followerID).toEqual(user1._id);


		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
		await NewFollowerNotifService.deleteById(knownNotif._id);
	})
})

describe('Removal of new follower notifiactions', () =>{
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		done();
	})

	afterAll(async done => {
		await mongoose_tester.connection.close();
		done();
	})


	it('Can remove a new follower notification', async () => {
		const user1 = await UserService.create(users[0]);
		let user2 = await UserService.create(users[1]);

		const knownNotif = await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);

		await FriendHandler.removeNotification(user2._id, knownNotif._id);
		user2 = await UserService.findById(user2._id);
		
		expect(user2.notifications.relations.unDismissed).toEqual(0);
		expect(user2.notifications.relations.newFollowerNote.length).toEqual(0);


		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
	})
})

describe("Structures the correct data to send for accessing a notification", () => {
	beforeAll(async done => {
		await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
		done();
	})

	afterAll(async done => {
		await mongoose_tester.connection.close();
		done();
	})

	it('Can structure the user data correctly for a new follower notification ID',  async () => {
		const user1 = await UserService.create(users[0]);
		let user2 = await UserService.create(users[1]);
		const notif = await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		user2 = await UserService.findById(user2._id);

		const dataToSend = await FriendHandler.prepareDataToSend(user2.notifications.relations.newFollowerNote);
		for(let i =0; i<dataToSend.length; i++){
			const data = dataToSend[i];
			expect(data.name).toEqual(user1.name);
			expect(data.school.name).toEqual(user1.school.name);
			expect(data.school.logoURL).toEqual(user1.school.logoURL);
			expect(data.profilePictureURL).toEqual(user1.profilePictureURL);
			expect(data.followerID).toEqual(user1._id);
			expect(data._id).toEqual(notif._id);
		}

		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
		await NewFollowerNotifService.deleteById(notif._id);
	})

	it('Can structure the user data correctly for multiple new follower notification ID',  async () => {
		const user1 = await UserService.create(users[0]);
		const user3 = await UserService.create(users[2]);
		let user2 = await UserService.create(users[1]);
		const notif = await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		const notif2 = await FriendHandler.createAndAddANewFollowerNotif(user3._id, user2._id);
		user2 = await UserService.findById(user2._id);

		const dataToSend = await FriendHandler.prepareDataToSend(user2.notifications.relations.newFollowerNote);
		for(let i =0; i<dataToSend.length; i++){
			const user = i===0 ? user1 : user3;
			const data = dataToSend[i];
			expect(data.name).toEqual(user.name);
			expect(data.school.name).toEqual(user.school.name);
			expect(data.school.logoURL).toEqual(user.school.logoURL);
			expect(data.profilePictureURL).toEqual(user.profilePictureURL);
			expect(data.followerID).toEqual(user._id);
		}

		await UserService.deleteById(user1._id);
		await UserService.deleteById(user2._id);
		await UserService.deleteById(user3._id);
		await NewFollowerNotifService.deleteById(notif._id);
		await NewFollowerNotifService.deleteById(notif2._id);
	})
})