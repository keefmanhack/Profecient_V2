import axios from './index';

class PostRequests{
	constructor(id){
		this.currUserID = id;
	}
	
	getFriendsPost = async () => {
		try{
			const friendsPosts_EndPoint = `/users/` + this.currUserID + '/friends/posts';
			const response = await axios.get(friendsPosts_EndPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default PostRequests;