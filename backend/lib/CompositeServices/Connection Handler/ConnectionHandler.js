const ClassService = require('../../Class/index');


class ConnectionHandler{
    static async new(userIDRec, classIDRec, userIDRequ, classIDRequ){
		if(!classIDRec || !userIDRec || !classIDRec || !userIDRec){
			throw new Error('Missing data to add a connection');
		}
        let res = await ClassService.addConnectionFrom(classIDRec, classIDRequ, userIDRequ);
        if(!res.success){return res}
        res = await ClassService.addConnectionTo(classIDRequ, classIDRec, userIDRec);
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