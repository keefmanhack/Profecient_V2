const ClassService = require('../Class/index'),
      UserService = require('../User/index'),
      ConnectionNotif = require('../Notification/Categories/Academic/New Connection/ConnectionNotif');


//Role: Process requests on Connections between classes

class ConnectionHandler{
  constructor(userID){
    this.userID = userID; //this probably doesn't need to exist
  }

  async getFormatted(classID){
    if(!classID){
      throw new Error('Missing id to get class links');
    }
    const toConnections = await ClassService.getToConnections(classID);
    let map = new Map();

    for(let i =0; i<toConnections.length; i++){
      const user = await UserService.findById(toConnections[i].userID);
      const classData = await ClassService.findById(toConnections[i].classID);
      const t = {
        user: {
          name: user.name,
          profilePictureURL: user.profilePictureURL,
          _id: user._id
        },
        classData: {
          name: classData.name,
          instructor: classData.instructor,
          location: classData.location,
          daysOfWeek: classData.daysOfWeek,
          assignments: classData.assignments,
          _id: classData._id,
        }
      }
      map.set(toConnections[i]._id, t);
    }
    return map;
  }

  static async new(userIDRec, classIDRec, userIDRequ, classIDRequ){
    if(!classIDRec || !userIDRec || !classIDRec || !userIDRec){
      throw new Error('Missing data to add a connection');
    }
        let res = await ClassService.addConnectionFrom(classIDRec, classIDRequ, userIDRequ);
        if(!res.success){return res}
        res = await ClassService.addConnectionTo(classIDRequ, classIDRec, userIDRec);
        if(!res.success){return res}

        //dispatch notification
        const CNotif = new ConnectionNotif(userIDRec);
        await CNotif.push(classIDRec, userIDRequ, classIDRequ);

        return res;
  }
  
  static async remove(userIDRec, classIDRec, userIDRequ, classIDRequ){
    if(!classIDRec || !userIDRec || !classIDRec || !userIDRec){
			throw new Error('Missing data to remove a connection');
    }
    let res = await ClassService.removeConnectionFrom(classIDRec, classIDRequ, userIDRequ);
    if(!res.success){return res}
    res = await ClassService.removeConnectionTo(classIDRequ, classIDRec, userIDRec);
    return res;
  }
}

module.exports = ConnectionHandler;