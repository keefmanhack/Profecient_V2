import axios from './index';

class ClassRequests{
	constructor(id){
		this.userID = id;
	}

	addNewConnection = async (recvUserID, recvClassID, reqClassID) =>{
		try{
			const endPoint = '/users/' + this.userID + '/class/connection';
			const data={
				recvUserID: recvUserID,
				recvClassID: recvClassID,
				reqClassID: reqClassID
			}
			const res = await axios.post(endPoint, data);
			return res.data;
		}catch(err){
			console.log(err);
			return {success: false, error: 'Unknown error adding new link'}
		}
	}

	removeAConnection = async (recvUserID, recvClassID, reqClassID) => {
		try{
			const endPoint = '/users/' + this.userID + '/class/connection/delete';
			const data={
				recvUserID: recvUserID,
				recvClassID: recvClassID,
				reqClassID: reqClassID
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