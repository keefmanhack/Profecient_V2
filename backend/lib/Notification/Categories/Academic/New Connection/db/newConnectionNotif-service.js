const BaseRequests = require('../../../../../BaseServiceRequests');

const create = Notification => async (classID, connectedUserID, connectedClassID) => {
    if(!classID || !connectedClassID || !connectedUserID){
        throw new Error('Missing data to create a new connection notification');
    }
    const t = {
        classID: classID,
        connectedClassID: connectedClassID,
        connectedUserID: connectedUserID,
    }
    const notif = await Notification.create(t);
    return notif;
}

module.exports = Notification => {
	return{
		findById: BaseRequests.findById(Notification),
        deleteById : BaseRequests.deleteById(Notification),
        
		create: create(Notification),
	}
}