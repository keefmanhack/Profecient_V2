const mongoose_tester = require('../../../mongoose_test_config');
// mongoose_tester.set('debug', true);
const UserService = require('../index');
const users = require('../../Testing Data/testUsers');

require('dotenv').config();

describe('Following and unfollowing', () =>{
    let user1, user2;
	beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        let res = await UserService.create(users[0]);
        user1 = res.user;
        res = await UserService.create(users[1]);
        user2 = res.user;
		done();
	})

	afterAll(async done => {
        await UserService.deleteAll();

		await mongoose_tester.connection.close();
		done();
	})

	it('Lets one user follow another user', async () => {
            await UserService.toggleUserFollowing(user1._id, user2._id, false);

            user1 = await UserService.findById(user1._id);
            expect(user1.following.length).toEqual(2); //because users follow themselves
            expect(user1.following[1]).toEqual(user2._id);
    })
    
    it('Lets one user unfollow another user', async () => {
        await UserService.toggleUserFollowing(user1._id, user2._id, true);

        user1 = await UserService.findById(user1._id);
        expect(user1.following.length).toEqual(1); //because users follow themselves
    })
})

describe('Can create a new user', () => {
    let user1;
    beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        done();
    })

    afterAll(async done => {
        await UserService.deleteAll();
        await mongoose_tester.connection.close();
        done();
    })

    it('Can create a new user', async () => {
        let res = await UserService.create(users[0]);
        if(res.success){
            user1 = res.user;
        }
    })
})