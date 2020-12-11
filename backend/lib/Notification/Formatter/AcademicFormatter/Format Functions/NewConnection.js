const ClassService = require('../../../../Class/index');
const UserService = require('../../../../User/index');
const NewConnectionNotifService = require('../../../Categories/Academic/New Connection/db/index');

const formatFunc = async newConnectionNotifID => {
    try{
        const notif = await NewConnectionNotifService.findById(newConnectionNotifID);
        const connectedUser = await UserService.findById(notif.connectedUserID);
        const myClass = await ClassService.findById(notif.classID);
        const connectedClass = await ClassService.findById(notif.connectedClassID);

        const data = {
            user: {
                name: connectedUser.name,
                schoolName: connectedUser.schoolName,
                schoolLogoURL: connectedUser.schoolLogoURL,
                profilePictureURL: connectedUser.profilePictureURL,
                _id: connectedUser._id,
            },
            myClass: {
                name: myClass.name,
                color: myClass.color,
                connectionLength: myClass.connectionsFrom.length,
            },
            connectedClass: {
                name: connectedClass.name,
            },
            timeStamp: notif.timeStamp,
            _id: notif._id,
            type: 'NewConnection'
        }
        return [data];
    }catch(err){
        console.log(err);
        return [];
    }
}

module.exports = formatFunc;