const BaseRequests = require('../BaseServiceRequests');

const insertItem = NotificationModel => async (id, item) =>{
    if(!item){
        throw new Error("Missing item to insert");
    }
    const notifications = await NotificationModel.findById(id);
    notifications.list.unshift({to: item._id, onModel: item.constructor.modelName});
    return await notifications.save();

}

const findItemByToID = NotificationModel => async (id, toID) => {
    if(!id || !toID){
        throw new Error('Missing data to find item by To ID');
    }
    const notifs = await NotificationModel.findById(id);
    const notifIndex = getListIndexByToID(notifs.list, toID);
    return notifs.list[notifIndex];
}

const sendItemToFrontByTo = NotificationModel => async (id, itemID) => {
    if(!id || !itemID){
        throw new Error("Missing data to change object position");
    }
    const notifs = await NotificationModel.findById(id);
    const itemIndex = notifs.list.indexOf(itemID);
    const item = notifs.list.pop(itemIndex);
    notifs.list.unshift(item);
    return await notifs.save();
}

const removeItemByToId = NotificationModel => async (id, itemID) => {
    if(!id || !itemID){
        throw new Error("Missing data to remove a notification item");
    }
    const foundNotifs = await NotificationModel.findById(id);
    foundNotifs.list.splice(getListIndexByToID(foundNotifs.list, itemID), 1);
    return await foundNotifs.save();
}

const findByIdAndPopulateList = NotificationModel => async id => {
    if(!id){
        throw new Error("Missing id to populate list");
    }
    return await NotificationModel.findById(id).populate({path: 'list', populate: {path: 'to'}});
}

function getListIndexByToID(notifList, id){
    for(let i =0; i<notifList.length; i++){
        if(notifList[i].to + '' === id + ''){
            return i;
        }
    }
}

module.exports = NotificationModel => {
    return{
        findById: BaseRequests.findById(NotificationModel),
        create: BaseRequests.create(NotificationModel),
        deleteById: BaseRequests.deleteById(NotificationModel),
        size: BaseRequests.size(NotificationModel),

        insertItem: insertItem(NotificationModel),
        sendItemToFrontByTo: sendItemToFrontByTo(NotificationModel),
        removeItemByToId: removeItemByToId(NotificationModel),
        findByIdAndPopulateList: findByIdAndPopulateList(NotificationModel),
        findItemByToID: findItemByToID(NotificationModel),
    }
}