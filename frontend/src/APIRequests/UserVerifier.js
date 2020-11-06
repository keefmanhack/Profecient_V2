import axios from './index';

import errors from '../UserCreator/ErrorCodes';

const notConnected = {isValid: false, errorCode: errors.NOT_CONNECTED}
class UserVerifier{
	verifyUserName = async username => {
		const endPoint = '/users/verify/?username=' + username;
		return await this.absractVerifier(endPoint);
	}

    verifyEmail = async email => {
		const endPoint = '/users/verify/?email=' + email;
		return await this.absractVerifier(endPoint);
    }
    
    verifyPhoneNumber = async phoneNumber => {
		const endPoint = '/users/verify/?phoneNumber=' + phoneNumber;
		return await this.absractVerifier(endPoint);
	}

	 absractVerifier = async endPoint => {
		try{
			const res = await axios.get(endPoint);
			return res.data;
		}catch(err){
			return notConnected;
		}
	}
}

export default UserVerifier;