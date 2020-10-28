const mongoose_tester = require('../../../../mongoose_test_config');
const FriendHandler = require('../../../CompositeServices/Notification/Relations/FriendHandler');
const NotificationService = require('../../../Notification/index');
const NewFollowerService = require('../../../Notification/Categories/Relations/New Follower/index');
const PostBucketNotifService = require('../../../Notification/Categories/Relations/PostBucket/index');
const RelFormatMap = require('./formatMap');
// mongoose_tester.set('debug', true);

const users = require('../../../testUsers');
const UserService = require('../../../User/index');
const Formatter = require('../formatter');
const PostHandler = require('../../../CompositeServices/Notification/Relations/PostHandler');

require('dotenv').config();

describe('Can properly format a newFollower notification', () => {
    let user1, user2, newFollowerNotif;
    beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        user1 = await UserService.create(users[0]);
        user2 = await UserService.create(users[1]);
        newFollowerNotif = await FriendHandler.createAndAddANewFollowerNotif(user1._id, user2._id);
		done();
    })

    afterAll(async done => {
        await NewFollowerService.deleteById(newFollowerNotif._id);
        await UserService.deleteById(user1._id);
        await UserService.deleteById(user2._id);
        await mongoose_tester.connection.close();
		done();
    })

    it('Can properly format the notification', async () => {
        //setup
        user2 = await UserService.findById(user2._id);
        const relNotifs = await NotificationService.findByIdAndPopulateList(user2.notifications.relations.notifBucket);
        const formattedData = await Formatter.format(relNotifs, RelFormatMap);
        //test
        expect(formattedData.length).toEqual(1);
        expect(formattedData[0].name).toEqual(user1.name);
        expect(formattedData[0].school.logoURL).toEqual(user1.school.logoURL);
        expect(formattedData[0].school.name).toEqual(user1.school.name);
        expect(formattedData[0].profilePictureURL).toEqual(user1.profilePictureURL);
        expect(formattedData[0].followerID).toEqual(user1._id);

        expect(formattedData[0]._id).toEqual(relNotifs.list[0].to._id);
        expect(formattedData[0].timeStamp).toEqual(relNotifs.list[0].to.timeStamp);
    })
})

describe('Can properly format a postbucket notif', () => {
    let user1, notifBucket, relNotifs, post;
    beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        user1 = await UserService.create(users[0]);
        PostHandler.createNewPost('Fake text', user1._id, null, async newPost => {
            post = newPost;
            notifBucket = await PostBucketNotifService.findById(newPost.notifBucketID);
            relNotifs = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
            done();
        })    
    })

    afterAll(async done => {
        PostHandler.deletePostAndNotifBucket(post._id, user1._id, () => {done();});
        await NotificationService.deleteById(relNotifs._id);
        await UserService.deleteById(user1._id);
        await mongoose_tester.connection.close();
		
    })

    it('Outputs correctly if there is no new data in a post bucket notif', async () => {
        const formattedData = Formatter.format(relNotifs, RelFormatMap);
        expect(formattedData).toEqual([]);
    })
})