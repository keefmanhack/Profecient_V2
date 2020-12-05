import axios from './index';

class ClassRequests{
	constructor(id){
		this.userID = id;
	}

	addNewConnection = async (recvConnectionClassID, connectingClassID) =>{
		try{
			const endPoint = '/users/' + this.userID + '/class/connection';
			const data={
				recvConnectionClassID: recvConnectionClassID,
				connectingClassID: connectingClassID
			}
			const res = await axios.post(endPoint, data);
			return res.data;
		}catch(err){
			console.log(err);
			return {success: false, error: 'Unknown error adding new link'}
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

	getCurrent = async () => {
		try{
			const endPoint = '/users/' + this.userID + '/current/classes';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return {success: false, error: 'Unknown error getting classes'}
		}
	}

	getClassesBySemester = async semID => {
		try{
			const endPoint = '/users/' + this.userID + '/semesters/' + semID + '/classes';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return {success: false, error: 'Unknown error getting classes'}
		}
	}
}
export default ClassRequests;