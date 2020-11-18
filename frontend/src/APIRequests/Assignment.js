import axios from './index';

class AssignmentRequests{
	constructor(id){
		this.currUserID = id;
	}

	addNewFromOtherUser = async (myClassID, notifID, assID) => {
		try{
			const endPoint = '/users/' + this.currUserID + '/classes/' + myClassID + '/assignment/fromConnection';
			const res = await axios.post(endPoint, {otherUserAssID: assID, noteID: notifID});
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	getUpcomming = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/assignment/upcomming';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}

	delete = async (classID, assID) => {
		try{
			const endPoint = `/users/` + this.currUserID + '/classes/' + classID + '/assignment/' + assID;
			const res =  await axios.delete(endPoint);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	create = async (classID, data) => {
		try{
			const endPoint = `/users/` + this.currUserID + '/classes/' + classID + '/assignment/'
			const res = await axios.post(endPoint, data);
			return res.data;
		}catch(err){
			console.log(err);
		}
	}

	update = async(classID, assID, newClassID, data) => {
		try{
			await this.delete(classID, assID);
			const res = await this.create(newClassID, data);
			return res; //res already holds data since create return res.data
		}catch(err){
			console.log(err);
			return {success: false}
		}
	}

	toggleCompleted = async (assID, data) => {
		try{
			const endPoint = '/assignment/' + assID
			return await axios.put(endPoint, data);
		}catch(err){
			console.log(err);
		}
	}

	getAll = async () =>{
		try{
			const endPoint = '/users/' + this.currUserID + '/assignments';
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return {success: false, error: 'Unknown error retreiving assignments'}
		}
	}



}
export default AssignmentRequests;