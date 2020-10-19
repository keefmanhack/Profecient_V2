import axios from './index';

class ClassRequests{
	constructor(id){
		this.currUserID = id;
	}

	addNewConnection = async (otherUserID, otherUserClassID, myClassID) =>{
		try{
			const endPoint = '/users/' + this.currUserID + '/class/connection';
			const data={
				otherUser: otherUserID,
				otherUserClass: otherUserClassID,
				currUserClass: myClassID,
			}
			const res = await axios.post(endPoint, data);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	getAssignments = async classID =>{
		try{
			const endPoint = '/users/' + this.currUserID + '/classes/' + classID + '/assignments';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default ClassRequests;