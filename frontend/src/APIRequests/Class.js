import axios from './index';

class ClassRequests{
	constructor(id){
		this.userID = id;
	}

	addNewConnection = async (otherUserID, otherUserClassID, myClassID, currUserID) =>{
		try{
			const endPoint = '/users/' + currUserID + '/class/connection';
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

	removeAConnection = async (otherUserID, currUserClass, otherUserClass, currUserID) => {
		try{
			const endPoint = '/users/' + currUserID + '/class/connection/delete';
			const data={
				otherUser: this.userID,
				currUserClass: currUserClass,
				otherUserClass: otherUserClass,
			}
			const res = await axios.post(endPoint, data);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	getAssignments = async classID =>{
		try{
			const endPoint = '/users/' + this.userID + '/classes/' + classID + '/assignments';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	findLinks = async (data, currentLinks) => {
		try{
			const endPoint = '/users/classes';
			const res = await axios.post(endPoint, {classData: data, currentLinks: currentLinks});
			return res.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default ClassRequests;