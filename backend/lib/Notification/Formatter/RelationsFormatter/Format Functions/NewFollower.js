const UserService = require('../../../../User/index');

const formatFunc = async newFollowerData => {
    try{
        const newFollower = await UserService.findById(newFollowerData.followerID);
        const data = {
            name: newFollower.name,
            school: newFollower.school,
            profilePictureURL: newFollower.profilePictureURL,
            followerID: newFollower._id,
            _id: newFollowerData._id,
            timeStamp: newFollowerData.timeStamp,
            type: 'NewFollower',
        }
        return [data];
    }catch(err){
        return [];
    }
}

module.exports = formatFunc;