import axios from './index';

class SemesterRequests{
	constructor(id){
		this.currUserID = id;
	}

	getCurrSemWClasses = async () => {
		try{
			const currSemWClasses_EndPoint = `/users/` + this.currUserID + '/semesters/current';
			const response = await axios.get(currSemWClasses_EndPoint);
			return response.data;
		}catch(err){
			console.log(err);
		}
	}
}
export default SemesterRequests;