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

	toggleUserFollowing = async (otherUserID, isFollowing) => {
		try{
			const endPoint = '/users/' + this.currUserID + '/following';
			const res = await axios.post(endPoint, {userID: otherUserID, isFollowing: isFollowing});
			return res.data 
		}catch(err){
			console.log(err);
		}

	}
	
	createTestUsers = async () => {
		try{
			const endPoint = '/createTestUsers';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default UserRequests;