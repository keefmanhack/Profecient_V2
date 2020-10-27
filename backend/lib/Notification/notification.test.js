const mongoose_tester = require('../../mongoose_test_config');
// mongoose_tester.set('debug', true);
const users = require('../testUsers');

const NotificationService = require('./index');
const PostBucketService = require('./Relations/PostBucket/index');
const NewFollowerService = require('./Relations/New Follower/index');
const UserService = require('../User/index');

require('dotenv').config();


describe('Able to insert generic items into list', () =>{
    let createdBucket, newFollowerNotif, Notifications, newUser;

	beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        newUser = await UserService.create();
        Notifications = await NotificationService.findById(newUser.notifications.relations.notifBucket);
        createdBucket = await PostBucketService.create();
        newFollowerNotif = await NewFollowerService.create(newUser._id);
		done();
	})

	afterAll(async done => {
        await PostBucketService.deleteById(createdBucket._id);
        await NewFollowerService.deleteById(newFollowerNotif._id);
        await NotificationService.deleteById(Notifications._id);
        await UserService.deleteById(newUser._id);

        await mongoose_tester.connection.close();
		done();
    })
    
    it('Can add a new item to the list', async () => {
        await NotificationService.insertItem(Notifications._id, createdBucket);
        await NotificationService.insertItem(Notifications._id, newFollowerNotif);

        notifBucket = await NotificationService.findById(Notifications._id);
        const res = await NotificationService.getPopulatedList(Notifications._id);

        expect(notifBucket.list.length).toEqual(2);
        expect(notifBucket.list[0].to).toEqual(createdBucket._id);
        expect(notifBucket.list[1].to).toEqual(newFollowerNotif._id);
    })
})