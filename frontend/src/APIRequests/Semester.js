import axios from './index';

class SemesterRequests{
	constructor(id){
		this.currUserID = id;
	}

	getCurrSemWClasses = async () => {
		try{
			const endPoint = `/users/` + this.currUserID + '/semesters/current';
			const response = await axios.get(endPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default SemesterRequests;