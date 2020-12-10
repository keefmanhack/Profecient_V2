const NewConnectionNotifService = require('./db/index'),
      AcademicNotifications     = require('../AcademicNotification');

class ConnectionNotif{
    constructor(userID){
        this.userID = userID;
    }

    push = async (classID, connectedClassID, connectedUserID) => {
        const notif = await NewConnectionNotifService.create(classID, connectedClassID, connectedUserID);
        const ACNotifs = new AcademicNotifications(this.userID);
        ACNotifs.push(notif);
    }
}

module.exports = ConnectionNotif;