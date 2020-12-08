const mongoose_tester = require('../../../mongoose_test_config');
const userGen = require('../../Testing Data/testUserGenerator');
const testClasses = require('../../Testing Data/testClasses');

const ClassService = require('../../Class/index');
const SemesterService = require('../../Semester/index');
const UserService =  require('../../User/index');


require('dotenv').config();

describe('Handeling adding and removing connections', () =>{
    let user1, user2, class1, class2, sem1, sem2;
	beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);

        class1 = await ClassService.create(testClasses[0]);
        sem1 = await SemesterService.create({name: 'User 1 Sem', classes: [class1]});
        UserService.create(userGen(), async res => {
            user1 =  res.user;
            user1.semesters.push(sem1);
            await user1.save();

            class2 = await ClassService.create(testClasses[1]);
            sem2 = await SemesterService.create({name: 'User 2 Sem', classes: [class2]});
            UserService.create(userGen(), async res => {
                user2 =  res.user;
                user2.semesters.push(sem2);
                await user1.save();
                done();
            })

        })
	})

	afterAll(async done => {
        await ClassService.deleteById(class1._id);
        await ClassService.deleteById(class2._id);
        await SemesterService.deleteById(sem1._id);
        await SemesterService.deleteById(sem2._id);
        await UserService.deleteById(user1._id);
        await UserService.deleteById(user2._id);

        await mongoose_tester.connection.close();
		done();
    })
    
    it('Can add a new connection from user1 to user2', async () => {
        const res = await ClassService.addConnectionFrom(class2._id, class1._id, user1._id);
        class2 = await ClassService.findById(class2._id);

        expect(res.success).toEqual(true);
        expect(class2.connectionsFrom.length).toEqual(1);
        const c = class2.connectionsFrom[0];
        expect(c.userID).toEqual(user1._id);
        expect(c.classID).toEqual(class1._id);

    })

    it('Does not allow new connection from user1 to user2 again', async () => {
        const res = await ClassService.addConnectionFrom(class2._id, class1._id, user1._id);
        class2 = await ClassService.findById(class2._id);

        expect(res.success).toEqual(false);
        expect(class2.connectionsFrom.length).toEqual(1);
    })

    it('Can remove a from connection for user 2', async () => {
        const res = await ClassService.removeConnectionFrom(class2._id, class1._id, user1._id);
        class2 = await ClassService.findById(class2._id);

        expect(res.success).toEqual(true);
        expect(class2.connectionsFrom.length).toEqual(0);
    })

    it('Properly handles removing an impossible from connection', async () => {
        const res = await ClassService.removeConnectionFrom(class2._id, class1._id, user1._id);
        class2 = await ClassService.findById(class2._id);

        expect(res.success).toEqual(false);
        expect(class2.connectionsFrom.length).toEqual(0);
    })

    it('Can add a new connection to connection for user 1', async () => {
        const res = await ClassService.addConnectionTo(class1._id, class2._id, user2._id);
        class1 = await ClassService.findById(class1._id);

        expect(res.success).toEqual(true);
        expect(class1.connectionsTo.length).toEqual(1);
        const c = class1.connectionsTo[0];
        expect(c.userID).toEqual(user2._id);
        expect(c.classID).toEqual(class2._id);
    })

    it('Does not add a second to connection for user 1', async () => {
        const res = await ClassService.addConnectionTo(class1._id, class2._id, user2._id);
        class1 = await ClassService.findById(class1._id);

        expect(res.success).toEqual(false);
        expect(class1.connectionsTo.length).toEqual(1);
    })

    it('Can remove a to connection for user 1', async () => {
        const res = await ClassService.removeConnectionTo(class1._id, class2._id, user2._id);
        class1 = await ClassService.findById(class1._id);

        expect(res.success).toEqual(true);
        expect(class1.connectionsFrom.length).toEqual(0);
    })

    it('Properly handles removing an impossible to connection', async () => {
        const res = await ClassService.removeConnectionTo(class1._id, class2._id, user2._id);
        class1 = await ClassService.findById(class1._id);

        expect(res.success).toEqual(false);
        expect(class1.connectionsFrom.length).toEqual(0);
    })
})