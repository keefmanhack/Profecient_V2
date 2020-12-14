const NotificationHandler = require('../../../../CompositeServices(temp)/Notification/NotificationHandler');
const UserService = require('../../../../User/index');

const formatFunc = async (newFollowerData, currUserID) => {
    try{
        const newFollower = await UserService.findById(newFollowerData.followerID);
        const data = {
            name: newFollower.name,
            schoolName: newFollower.schoolName,
            schoolLogoURL: newFollower.schoolLogoURL,
            profilePictureURL: newFollower.profilePictureURL,
            followerID: newFollower._id,
            _id: newFollowerData._id,
            timeStamp: newFollowerData.timeStamp,
            type: 'NewFollower',
        }
        return [data];
    }catch(err){
        await NotificationHandler.removeRelationNotifById(currUserID, newFollowerData._id);
        console.log('Removed a notification with')
        return [];
    }
}

module.exports = formatFunc;