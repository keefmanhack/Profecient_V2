const NewAssignmentNotifService = require('./db/index'),
      AcademicNotifications     = require('../AcademicNotification');

class NewAssignmentNotif{
    constructor(userID){
        this.userID = userID;
    }

    push = async (newAssID, parentClass) => {
        const notifStruct = {assignmentID: newAssID, ownerID: this.userID, parentClassID: parentClass._id}
        let res = [];
		for(let i =0; i< parentClass.connectionsFrom.length; i++){
			const connection = parentClass.connectionsFrom[i];
            const notif = await NewAssignmentNotifService.create(notifStruct);

            const ACNotifs = new AcademicNotifications(connection.userID);
            res.push(await ACNotifs.push(notif));
        }
        return res;
    }
}

module.exports = NewAssignmentNotif;