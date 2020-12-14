const mongoose_tester = require('../../../mongoose_test_config');
// mongoose_tester.set('debug', true);

const userGen = require('../../Testing Data/testUserGenerator');
const testClasses = require('../../Testing Data/testClasses');
const testAss = require('../../Testing Data/testAssignments');

const AssignmentHandler = require('./AssignmentHandler');
const ClassService = require('../../Class/index');
const SemesterService = require('../../Semester/index');
const UserService = require('../../User/index');
const ConnectionHandler = require('../../Connection Handler/ConnectionHandler');
const NotificationService = require('../../Notification/index');

require('dotenv').config();

describe('Proper handeling of assignment creation', () =>{
    let user1, user2, class1, class2, sem1, sem2;
	beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);

        class1 = await ClassService.create(testClasses[0]);
        sem1 = await SemesterService.create({name: 'User 1 Sem', classes: [class1]});
        UserService.create(userGen(), async res => {
            user1 = res.user;
            user1.semesters.push(sem1);
            await user1.save();

            UserService.create(userGen(), async res => {
                user2 = res.user;
                class2 = await ClassService.create(testClasses[1]);
                sem2 = await SemesterService.create({name: 'User 2 Sem', classes: [class2]});
                
                user2.semesters.push(sem2);
                await user2.save();
                
                await ConnectionHandler.new(user2._id, class2._id, user1._id, class1._id); //Come back dummy

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
    
    
    it('Can create a new assignment', async () => {
        const res = await AssignmentHandler.new(user2._id, class2._id, testAss[0]);

        class2 = await ClassService.findById(class2._id);
        
        expect(res.success).toEqual(true);
        expect(class2.assignments.length).toEqual(1);

        expect(res.newAssignment.name).toEqual(testAss[0].name);
    })

    it('Dispatches a notification to user1 that an assignment was added by user 2', async () => {
        user1 = await UserService.findById(user1._id);
        const acNotifs = await NotificationService.findById(user1.notifications.academic.notifBucket);
        
        expect(user1.notifications.academic.unDismissed).toEqual(1);
        expect(acNotifs.list.length).toEqual(1);
        expect(acNotifs.list[0].onModel).toEqual('NewAssignment');
    })
})