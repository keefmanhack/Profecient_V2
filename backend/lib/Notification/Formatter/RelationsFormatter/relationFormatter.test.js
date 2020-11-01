const mongoose_tester = require('../../../../mongoose_test_config');
const FriendHandler = require('../../../CompositeServices/Notification/Relations/FriendHandler');
const NotificationService = require('../../../Notification/index');
const NewFollowerService = require('../../../Notification/Categories/Relations/New Follower/index');
const PostBucketNotifService = require('../../../Notification/Categories/Relations/PostBucket/index');
const RelFormatMap = require('./formatMap');
// mongoose_tester.set('debug', true);

const users = require('../../../Testing Data/testUsers');
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
        // await UserService.deleteById(user1._id);
        await UserService.deleteById(user2._id);
        await mongoose_tester.connection.close();
		done();
    })

    it('Can properly format the notification', async () => {
        //setup
        user2 = await UserService.findById(user2._id);
        const relNotifs = await NotificationService.findByIdAndPopulateList(user2.notifications.relations.notifBucket);
        const formattedData = await Formatter.format(relNotifs, RelFormatMap, user2._id);
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

    it('Removes a new follower notification if there is an error', async done => {
        await UserService.deleteById(user1._id);
        const relNotifBucketID = await UserService.getNotifBucketID(user2._id, UserService.notifCategories.relation);
        let relNotifs = await NotificationService.findByIdAndPopulateList(relNotifBucketID);
        const formattedData = await Formatter.format(relNotifs, RelFormatMap, user2._id);
        relNotifs = await NotificationService.findByIdAndPopulateList(relNotifBucketID);

        expect(formattedData.length).toEqual(0);
        expect(relNotifs.list.length).toEqual(0);

        done();
    })
})

describe('Can properly format a postbucket notif', () => {
    let user1, notifBucket, relNotifs, post;
    beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        user1 = await UserService.create(users[0]);
        user2 = await UserService.create(users[1]);
        PostHandler.createNewPost('Fake text', user1._id, null, async newPost => {
            post = newPost;
            notifBucket = await PostBucketNotifService.findById(newPost.notifBucketID);
            relNotifs = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
            done();
        })    
    })

    afterAll(async done => {
        PostHandler.deletePost(post._id, user1._id, async () => {
            await NotificationService.deleteById(relNotifs._id);
            await UserService.deleteById(user1._id);
            await UserService.deleteById(user2._id);
            await mongoose_tester.connection.close();
            done();
        });		
    })

    it('Outputs correctly if there is no new data in a post bucket notif', async () => {
        const formattedData = await Formatter.format(relNotifs, RelFormatMap, user1._id);
        expect(formattedData).toEqual([]);
    })

    it('Outputs correctly if post is liked once', async done => {
        await PostHandler.toggleLiked(user1._id, post._id, user1._id);
        relNotifs = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);

        const formattedData = await Formatter.format(relNotifs, RelFormatMap, user1._id);

        expect(formattedData.length).toEqual(1);
        expect(formattedData[0].likeData.lastLiker.name).toEqual(user1.name);
        expect(formattedData[0].likeData.lastLiker.profilePictureURL).toEqual(user1.profilePictureURL);
        expect(formattedData[0].likeData.otherLikerCt).toEqual(0);
        expect(formattedData[0].postData.id).toEqual(post._id);
        expect(formattedData[0].postData.text).toEqual(post.text);
        expect(formattedData[0].postData.photos.length).toEqual(0);
        done();
    })


    it('Properly handles multiple likes on a post', async done => {
        // await PostHandler.toggleLiked(user1._id, post._id, user1._id);
        await PostHandler.toggleLiked(user1._id, post._id, user2._id);
        relNotifs = await NotificationService.findByIdAndPopulateList(user1.notifications.relations.notifBucket);
        const formattedData = await Formatter.format(relNotifs, RelFormatMap, user1._id);

        expect(formattedData.length).toEqual(1);
        expect(formattedData[0].likeData.lastLiker.name).toEqual(user2.name);
        expect(formattedData[0].likeData.lastLiker.profilePictureURL).toEqual(user2.profilePictureURL);
        expect(formattedData[0].likeData.otherLikerCt).toEqual(1);
        expect(formattedData[0].postData.id).toEqual(post._id);
        expect(formattedData[0].postData.text).toEqual(post.text);
        expect(formattedData[0].postData.photos.length).toEqual(0);

        done();
    })
})