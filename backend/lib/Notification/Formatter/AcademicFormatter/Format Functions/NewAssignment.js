const ClassService = require('../../../../Class/index');
const UserService = require('../../../../User/index');
const AssignmentService =  require('../../../../Assignment/db/index');
const NewAssignmentNotifService = require('../../../Categories/Academic/New Assignment/db/index');

const formatFunc = async (newAssignmentNotifID, userID) => {
    try{
        const newAssignmentData = await NewAssignmentNotifService.findById(newAssignmentNotifID);

        const assignment = await AssignmentService.findById(newAssignmentData.assignmentID);
        const otherUser = await UserService.findById(newAssignmentData.ownerID);
        const foundClass = await ClassService.findById(newAssignmentData.parentClassID);
        const data = {
            user: {
                name: otherUser.name,
                schoolName: otherUser.schoolName,
                schoolLogoURL: otherUser.schoolLogoURL,
                profilePictureURL: otherUser.profilePictureURL,
                _id: otherUser._id,
            },
            assignment: {
                name: assignment.name,
                description: assignment.description,
                dueDate: assignment.dueDate,
                parentClassName: foundClass.name,
            },
            timeStamp: newAssignmentData.timeStamp,
            _id: newAssignmentData._id,
            type: 'NewAssignment'
        }
        return [data];
    }catch(err){
        console.log(err);
        return [];
    }
}

module.exports = formatFunc;