const BaseRequests = require('../BaseServiceRequests');

const insertItem = NotificationModel => async (id, item) =>{
    if(!item){
        throw new Error("Missing item to insert");
    }
    const notifications = await NotificationModel.findById(id);
    notifications.list.push({to: item._id, onModel: item.constructor.modelName});
    return await notifications.save();

}

const sendItemToFront = NotificationModel => async (id, itemID) => {
    if(!id || !itemID){
        throw new Error("Missing data to change object position");
    }
    const notifs = await NotificationModel.findById(id);
    const itemIndex = notifs.list.indexOf(itemID);
    notifs.list.splice(itemIndex, 1);
    notifs.list.push(itemID);
    return await notifs.save();
}

const removeItem = NotificationModel => async (id, itemID) => {
    if(!id || !itemID){
        throw new Error("Missing data to remove a notification item");
    }
    const foundNotifs = await NotificationModel.findById(id);
    foundNotifs.list.pull(itemID);
    return await foundNotifs.save();
}

const getPopulatedList = NotificationModel => async id => {
    if(!id){
        throw new Error("Missing id to populate list");
    }
    return await NotificationModel.findById(id).populate({path: 'list', populate: {path: 'to'}});
}

module.exports = NotificationModel => {
    return{
        findById: BaseRequests.findById(NotificationModel),
        create: BaseRequests.create(NotificationModel),
        deleteById: BaseRequests.deleteById(NotificationModel),

        insertItem: insertItem(NotificationModel),
        sendItemToFront: sendItemToFront(NotificationModel),
        removeItem: removeItem(NotificationModel),
        getPopulatedList: getPopulatedList(NotificationModel),
    }
}