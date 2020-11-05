import axios from './index';

import errors from '../UserCreator/ErrorCodes';

const notConnected = {isValid: false, errorCode: errors.NOT_CONNECTED}
class UserVerifier{
    verifyEmail = async email => {
		try{
			const endPoint = '/users/verify/?email=' + email;
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return notConnected;
		}
    }
    
    verifyPhoneNumber = async phoneNumber => {
		try{
			const endPoint = '/users/verify/?phoneNumber=' + phoneNumber;
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return notConnected;
		}
	}
}

export default UserVerifier;