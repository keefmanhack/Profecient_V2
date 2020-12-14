const mongoose_tester = require('../../mongoose_test_config');
const userGen = require('../Testing Data/testUserGenerator');
const testClasses = require('../Testing Data/testClasses');

const ClassService = require('../Class/index');
const SemesterService = require('../Semester/index');
const UserService =  require('../User/index');
const NotificationService = require('../Notification/index');

const ConnectionHandler = require('./ConnectionHandler');

require('dotenv').config();

describe('Handeling new connections', () =>{
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
    
    it('Can add a new connection to user2 class', async () => {
        const res = await ConnectionHandler.new(user2._id, class2._id, user1._id, class1._id);

        class2 = await ClassService.findById(class2._id);
        class1 = await ClassService.findById(class1._id);

        expect(res.success).toEqual(true);
        expect(class2.connectionsFrom.length).toEqual(1);
        expect(class1.connectionsTo.length).toEqual(1);
        expect(class2.connectionsFrom[0].userID).toEqual(user1._id);
        expect(class2.connectionsFrom[0].classID).toEqual(class1._id);
        expect(class1.connectionsTo[0].userID).toEqual(user2._id);
        expect(class1.connectionsTo[0].classID).toEqual(class2._id);
    })

    it('Dispatches a notification to user2 that a new connection was made', async () => {
        user2 = await UserService.findById(user2._id);
        const acNotifs = await NotificationService.findById(user2.notifications.academic.notifBucket);
        
        expect(user2.notifications.academic.unDismissed).toEqual(1);
        expect(acNotifs.list.length).toEqual(1);
        expect(acNotifs.list[0].onModel).toEqual('NewConnection');
    })

    it('Does not add new connection to user2 class', async () => {
        const res = await ConnectionHandler.new(user2._id, class2._id, user1._id, class1._id);

        class2 = await ClassService.findById(class2._id);
        class1 = await ClassService.findById(class1._id);
        expect(res.success).toEqual(false);
        expect(class2.connectionsFrom.length).toEqual(1);
        expect(class1.connectionsTo.length).toEqual(1);
    })

    it('Can remove a new connection to user2 class', async () => {
        const res = await ConnectionHandler.remove(user2._id, class2._id, user1._id, class1._id);
        class2 = await ClassService.findById(class2._id);
        class1 = await ClassService.findById(class1._id);

        expect(res.success).toEqual(true);
        expect(class2.connectionsFrom.length).toEqual(0);
        expect(class1.connectionsTo.length).toEqual(0);
    })

    // it('Can properly handle new connections', async () => {
    //     await AcademicHandler.addNewConnection(class2._id, user2._id, class1._id, user1._id);
    //     class2 = await ClassService.findById(class2._id);
    //     class1 = await ClassService.findById(class1._id);


    //     expect(class2.connectionsFrom.length).toEqual(1);
    //     expect(class2.connectionsFrom[0].userID).toEqual(user1._id);
    //     expect(class2.connectionsFrom[0].classID).toEqual(class1._id);

    //     expect(class1.connectionsTo.length).toEqual(1);
    //     expect(class1.connectionsTo[0].userID).toEqual(user2._id);
    //     expect(class1.connectionsTo[0].classID).toEqual(class2._id);
    // })

    // it('Does not add a connection which already exists', async () => {
    //     await AcademicHandler.addNewConnection(class2._id, user2._id, class1._id, user1._id);
    //     class2 = await ClassService.findById(class2._id);
    //     class1 = await ClassService.findById(class1._id);

    //     expect(class2.connectionsFrom.length).toEqual(1);
    //     expect(class1.connectionsTo.length).toEqual(1);
    // })
    
})