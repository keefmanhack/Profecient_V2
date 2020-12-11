const NewConnectionNotifService = require('./db/index'),
      AcademicNotifications     = require('../AcademicNotification');

class ConnectionNotif{
    constructor(userID){
        this.userID = userID;
    }

    push = async (classID, connectedUserID, connectedClassID) => {
        const notif = await NewConnectionNotifService.create(classID, connectedUserID, connectedClassID);
        const ACNotifs = new AcademicNotifications(this.userID);
        const res = await ACNotifs.push(notif);
        return res;
    }
}

module.exports = ConnectionNotif;