import axios from './index';

class UserRequests{
	constructor(id){
		this.currUserID = id;
	}

	findMultiple = async name => {
		try{
			const endPoint = '/users';
			const res = await axios.post(endPoint, {searchString: name});
			return res.data;
		}catch(err){
			console.log(err);
		}
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

	toggleUserFollowing = async otherUserID => {
		try{
			const endPoint = '/users/' + this.currUserID + '/following';
			const res = await axios.post(endPoint, {userID: otherUserID});
			return res.data 
		}catch(err){
			console.log(err);
		}

	}
}
export default UserRequests;