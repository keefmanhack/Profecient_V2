const mongoose_tester = require('../../../../mongoose_test_config');

const userGen = require('../../../Testing Data/testUserGenerator');
const testClasses = require('../../../Testing Data/testClasses');
const testAss = require('../../../Testing Data/testAssignments');

const ClassService = require('../../../Class/index');
const SemesterService = require('../../../Semester/index');
const UserService = require('../../../User/index');
const AcademicHandler = require('../../../CompositeServices/Notification/Academic/AcademicHandler');
const NotificationService = require('../../../Notification/index');
const Formatter = require('../formatter');
const academicFormatMap = require('./formatMap');
const AssignmentService = require('../../../Assignment/index');

const ACFormatter = require('./ACFormatter');
const ConnectionHandler = require('../../../CompositeServices/Connection Handler/ConnectionHandler');

require('dotenv').config();

describe('Formatting academic notifications', () => {
    let user1, user2, class1, class2, sem1, sem2, ass;
    beforeAll(async done => {
        await mongoose_tester.connect(process.env.PROF_MONGO_DB_TEST);

        class1 = await ClassService.create(testClasses[0]);
        sem1 = await SemesterService.create({name: 'User 1 Sem', classes: [class1]});
        UserService.create(userGen(), async res=>{
            user1=res.user;
            user1.semesters.push(sem1);
            await user1.save();

            class2 = await ClassService.create(testClasses[1]);
            sem2 = await SemesterService.create({name: 'User 2 Sem', classes: [class2]});
            UserService.create(userGen(), async res=>{
                user2=res.user;
                user2.semesters.push(sem2);
                await user2.save();
    

                await ConnectionHandler.new(user2._id, class2._id, user1._id, class1._id);
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
        
        await AssignmentService.deleteById(ass._id);

        await mongoose_tester.connection.close();
        done();	
    })

    it('Can properly format a new connection notification', async () => {
        const acf = new ACFormatter(user2._id);
        const formattedList = await acf.format();
        
        expect(formattedList.length).toEqual(1);
        const t = formattedList[0];
        
        expect(t.user._id).toEqual(user1._id);
        expect(t.myClass.name).toEqual(class2.name);
        expect(t.connectedClass.name).toEqual(class1.name);
    })

    it('Can properly format a new assignment notification', async () => {
        ass = await AcademicHandler.newAssignment(user2._id, class2._id, testAss[0]);
        const acf = new ACFormatter(user1._id);
        const formattedList = await acf.format();
        
        expect(formattedList.length).toEqual(1);
        expect(formattedList[0].user.name).toEqual(user2.name);
        expect(formattedList[0].user.schoolName).toEqual(user2.schoolName);
        expect(formattedList[0].user.schoolLogoURL).toEqual(user2.schoolLogoURL);
        expect(formattedList[0].user.profilePictureURL).toEqual(user2.profilePictureURL);
        
        expect(formattedList[0].assignment.name).toEqual(ass.name);
        expect(formattedList[0].assignment.description).toEqual(ass.description);
        expect(formattedList[0].assignment.dueDate).toEqual(ass.dueDate);
        expect(formattedList[0].assignment.parentClassName).toEqual(class2.name);
    })
})