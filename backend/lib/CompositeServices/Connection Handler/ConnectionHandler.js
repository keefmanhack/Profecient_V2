const ClassService = require('../../Class/index'),
      ConnectionNotif = require('../../Notification/Categories/Academic/New Connection/ConnectionNotif');


class ConnectionHandler{
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