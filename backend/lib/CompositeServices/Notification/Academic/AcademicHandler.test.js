const mongoose_tester = require('../../../../mongoose_test_config');
// mongoose_tester.set('debug', true);

const userGen = require('../../../Testing Data/testUserGenerator');
const testClasses = require('../../../Testing Data/testClasses');
const testAss = require('../../../Testing Data/testAssignments');

const AcademicHandler = require('./AcademicHandler');
const ClassService = require('../../../Class/index');
const SemesterService = require('../../../Semester/index');
const UserService = require('../../../User/index');
const NotificationService = require('../../../Notification/index');
const NewAssignmentService = require('../../../Notification/Categories/Academic/New Assignment/index');

require('dotenv').config();

describe('Proper handeling of assignment creation', () =>{
    let user1, user2, class1, class2, sem1, sem2, newAssNotif;
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
    
    it('Can properly handle new connections', async () => {
        await AcademicHandler.addNewConnection(class2._id, user2._id, class1._id, user1._id);
        class2 = await ClassService.findById(class2._id);
        class1 = await ClassService.findById(class1._id);


        expect(class2.connectionsFrom.length).toEqual(1);
        expect(class2.connectionsFrom[0].userID).toEqual(user1._id);
        expect(class2.connectionsFrom[0].classID).toEqual(class1._id);

        expect(class1.connectionsTo.length).toEqual(1);
        expect(class1.connectionsTo[0].userID).toEqual(user2._id);
        expect(class1.connectionsTo[0].classID).toEqual(class2._id);
    })

    it('Does not add a connection which already exists', async () => {
        await AcademicHandler.addNewConnection(class2._id, user2._id, class1._id, user1._id);
        class2 = await ClassService.findById(class2._id);
        class1 = await ClassService.findById(class1._id);

        expect(class2.connectionsFrom.length).toEqual(1);
        expect(class1.connectionsTo.length).toEqual(1);
    })

    it('Properly handles adding a new assignment', async () => {
        let newAss = await AcademicHandler.newAssignment(user2._id, class2._id, testAss[0]);
        user1 = await UserService.findById(user1._id);
        const academicNotifs = await NotificationService.findById(user1.notifications.academic.notifBucket);

        newAssNotif = await NewAssignmentService.findById(academicNotifs.list[0].to);

        expect(academicNotifs.list.length).toEqual(1)
        expect(academicNotifs.list[0].to).toEqual(newAssNotif._id);

        expect(newAssNotif.assignmentID).toEqual(newAss._id);
        expect(newAssNotif.ownerID).toEqual(user2._id);
        expect(newAssNotif.parentClassID).toEqual(class2._id);
    })

    it('Can remove a new assignment notification', async () => {
        await AcademicHandler.removeNotification(user1._id, newAssNotif._id);
        const acNotifBucketID = await UserService.getNotifBucketID(user1._id, UserService.notifCategories.academic);
        const acNotifs = await NotificationService.findById(acNotifBucketID);

        expect(acNotifs.list.length).toEqual(0);
    })
})