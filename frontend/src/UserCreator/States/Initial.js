/* 
Fake Interface
--------------
isValid()
handleError()
getNextState()
*/
import Final from './Final';
import errors from '../../APIRequests/User Verifier/ErrorCodes';
import Landing from  '../../Components/Login Landing/Landing-UserCreator/States/Initial/landing';
import UserVerifier from '../../APIRequests/User Verifier/UserVerifier';

import GenericErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/GenericErr';
import EmailErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/EmailErr';
import PhoneNumberErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/PhoneNumberErr';
import NotConnectedErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/NotConnectedErr';
import LandingPage2 from '../../Components/Login Landing/Landing-UserCreator/States/Final/Final';

class Initial{
    constructor(){
        this.nextState= new Final();
        this.validation = null;
        this.component= Landing;
        this.userVerifier = new UserVerifier();
    }

    getComponent(){
        return this.component;
    }

    getNextState(){
        return this.nextState;
    }

    async isValid(user){
        try{
            this.validation = await this.userVerifier.verifyEmail(user.email);
            if(this.validation.exists){
                return false;
            }
            this.validation = await this.userVerifier.verifyPhoneNumber(user.phoneNumber);
            if(this.validation.exists){
                return false;
            }
            return true;
        }catch(err){
            return false;
        }
    }

    handleError(){
        if(!this.validation){return GenericErr}
        if(this.validation.errorCode === errors.EMAIL_EXISTS){
            return EmailErr;
        }else if(this.validation.errorCode === errors.PHONE_NUMBER_EXISTS){
            return PhoneNumberErr;
        }else if(this.validation.errorCode === errors.NOT_CONNECTED){
            return NotConnectedErr;
        }else{
            return GenericErr;
        }
    }
}

export default Initial;