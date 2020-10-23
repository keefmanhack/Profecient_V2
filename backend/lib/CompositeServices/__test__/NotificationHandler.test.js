const NotificationHandler = require('../NotificationHandler');
const mongoose_tester = require('../../../mongoose_test_config.js');
const UserService = require('../../User/index');
const NewFollowerNotifService = require('../../Notification/Relations/New Follower/index');

require('dotenv').config();

const user1Data={
	name: 'Stan Smith',
	school: {
		name: 'Stans University',
		logoUrl: 'Stans School LogoUrl',
	},
	profilePictureURL: 'Stans profilePictureURL',
}

const user2Data={
	name: 'Queen Latifa',
	school: {
		name: 'Queens University',
		logoUrl: 'Queens School LogoUrl',
	},
	profilePictureURL: 'Queens profilePictureURL',
}

const user3Data={
	name: 'King Bee',
	school: {
		name: 'Kings University',
		logoUrl: 'Kings School LogoUrl',
	},
	profilePictureURL: 'Kings profilePictureURL',
}

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
		const user1 = await UserService.create(user1Data);
		let user2 = await UserService.create(user2Data);
		const user2RelationUnDismissedCt = user2.notifications.relations.unDismissed;

		const knownNotif = await NotificationHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
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
		const user1 = await UserService.create(user1Data);
		let user2 = await UserService.create(user2Data);
		const notif = await NotificationHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		user2 = await UserService.findById(user2._id);

		const dataToSend = await NotificationHandler.prepareDataToSend(user2.notifications.relations.newFollowerNote);
		for(let i =0; i<dataToSend.length; i++){
			const data = dataToSend[i];
			expect(data.name).toEqual(user1.name);
			expect(data.school.name).toEqual(user1.school.name);
			expect(data.school.logoURL).toEqual(user1.school.logoURL);
			expect(data.profilePictureURL).toEqual(user1.profilePictureURL);
			expect(data.followerID).toEqual(user1._id);
		}
	})

	it('Can structure the user data correctly for multiple new follower notification ID',  async () => {
		const user1 = await UserService.create(user1Data);
		const user3 = await UserService.create(user3Data);
		let user2 = await UserService.create(user2Data);
		const notif = await NotificationHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		const notif2 = await NotificationHandler.createAndAddANewFollowerNotif(user3._id, user2._id);
		user2 = await UserService.findById(user2._id);

		const dataToSend = await NotificationHandler.prepareDataToSend(user2.notifications.relations.newFollowerNote);
		for(let i =0; i<dataToSend.length; i++){
			const user = i===0 ? user1 : user3;
			const data = dataToSend[i];
			expect(data.name).toEqual(user.name);
			expect(data.school.name).toEqual(user.school.name);
			expect(data.school.logoURL).toEqual(user.school.logoURL);
			expect(data.profilePictureURL).toEqual(user.profilePictureURL);
			expect(data.followerID).toEqual(user._id);
		}
	})
})