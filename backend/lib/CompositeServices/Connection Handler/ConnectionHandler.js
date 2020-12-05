const ClassService = require('../../Class/index');


class ConnectionHandler{
    static async new(userIDRec, classIDRec, userIDRequ, classIDRequ){
		if(!classIDRec || !userIDRec || !classIDRec || !userIDRec){
			return {success: false, error: 'Missing data to add connection'}
		}
        let res = await ClassService.addConnectionFrom(classIDRec, classIDRequ, userIDRequ);
        if(!res.success){return res}
        res = await ClassService.addConnectionTo(classIDRequ, classIDRec, userIDRec);
        return res;
	}
}

module.exports = ConnectionHandler;