import axios from './index';

class UserRequests{
	constructor(id){
		this.currUserID = id;
	}
	
	getUser = async () => {
		try{
			const endPoint = '/users/' + this.currUserID;
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	toggleFriend = async (isFriend, otherUserID) => {
		try{
			const endPoint = '/users/' + this.currUserID + '/friends';
			const res = await axios.post(endPoint, {isFriend: isFriend, userID: otherUserID});
			return res.data 
		}catch(err){
			console.log(err);
		}

	}
}
export default UserRequests;