const ClassService = require('../../../../Class/index');
const UserService = require('../../../../User/index');
const AssignmentService =  require('../../../../Assignment/index');

const formatFunc = async (newAssignmentData, userID) => {
    try{
        const assignment = await AssignmentService.findById(newAssignmentData.assignmentID);
        const otherUser = await UserService.findById(newAssignmentData.ownerID);
        const foundClass = await ClassService.findById(newAssignmentData.parentClassID);
        const data = {
            user: {
                name: otherUser.name,
                school: otherUser.school,
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