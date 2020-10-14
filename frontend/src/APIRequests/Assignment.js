import axios from './index';

class AssignmentRequests{
	constructor(id){
		this.currUserID = id;
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
			return await axios.delete(endPoint);
		}catch(err){
			console.log(err);
		}
	}

	create = async (classID, data) => {
		try{
			const endPoint = `/users/` + this.currUserID + '/classes/' + classID + '/assignment/'
			return await axios.post(endPoint, data);
		}catch(err){
			console.log(err);
		}
	}

	update = async(classID, assID, newClassID, data) => {
		try{
			await this.delete(classID, assID);
			return await this.create(newClassID, data);
		}catch(err){
			console.log(err);
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




}
export default AssignmentRequests;