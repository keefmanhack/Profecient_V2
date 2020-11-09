const mongoose_tester = require('../../../mongoose_test_config');
// mongoose_tester.set('debug', true);
const UserService = require('../index');
const userGen = require('../../Testing Data/testUserGenerator');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../user-model');

require('dotenv').config();

describe('Following and unfollowing', () =>{
    let user1, user2;
	beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        user1 = (await UserService.create(userGen())).user;
        user2 = (await UserService.create(userGen())).user;
		done();
	})

	afterAll(async done => {
        await UserService.deleteById(user1._id);
        await UserService.deleteById(user2._id);
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
    let user1, password;
    beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);
        
        // passport.use(new LocalStrategy(User.authenticate()));
        // passport.serializeUser(User.serializeUser());
        // passport.deserializeUser(User.deserializeUser(async function(id, done){
        //     const user = await UserService.findById(id);
        //     console.log(user);
        // }));


        done();
    })

    afterAll(async done => {
        await UserService.deleteById(user1._id);
        await mongoose_tester.connection.close();
        done();
    })

    it('Can create a new user', async () => {
        const genUser = userGen();
        password = genUser.password;
        let res = await UserService.create(genUser);
        if(res.success){
            user1 = res.user;
        }
    })
})