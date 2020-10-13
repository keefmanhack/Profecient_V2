import axios from './index';

class UserRequests{
	constructor(id){
		this.currUserID = id;
	}
	
	requestUserByID = id =>{
		console.log(id);
		axios.get('/users/5f4aa6042c0c8f715ae71d97')
		.then((res) => {
			console.log(res.data);
		})
	}
}
export default UserRequests;