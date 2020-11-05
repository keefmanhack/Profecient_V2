/* 
Fake Interface
--------------
isValid()
handleError()
getNextState()
*/
import next from './Final';
import errors from '../ErrorCodes';
import Landing from  '../../Components/Login Landing/Landing-UserCreator/States/Initial/landing';
import UserVerifier from '../../APIRequests/UserVerifier';

import GenericErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/GenericErr';
import EmailErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/EmailErr';
import PhoneNumberErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/PhoneNumberErr';
import NotConnectedErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/NotConnectedErr';

class Initial{
    constructor(){
        this.nextState=next;
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
            if(!this.validation.isValid){
                return false;
            }
            this.validation = await this.userVerifier.verifyPhoneNumber(user.phoneNumber);
            if(!this.validation.isValid){
                return false;
            }
            return true;
        }catch(err){
            return false;
        }
    }

    handleError(){
        if(!this.validation){return null}
        console.log(this.validation);
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