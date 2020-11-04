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
import UserRequests from '../../APIRequests/User';

import GenericErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/GenericErr';
import EmailErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/EmailErr';
import PhoneNumberErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/PhoneNumberErr';

class Initial{
    constructor(){
        this.nextState=next;
        this.validation = null;
        this.component= Landing;
        this.userReq = new UserRequests(null);
    }

    getComponent(){
        return this.component;
    }

    getNextState(){
        return this.nextState;
    }

    async isValid(user){
        try{
            this.validation = await this.userReq.verifyEmail(user.email);
            if(!this.validation.isValid){
                return false;
            }
    
            return true;
        }catch(err){
            return false;
        }
    }

    handleError(){
        return EmailErr;
        if(this.validation === null){return null}
        if(this.validation.errorCode === errors.EMAIL_EXISTS){
            return EmailErr;
        }else if(this.validation.errorCode === errors.PHONE_NUMBER_EXISTS){
            return PhoneNumberErr;
        }else{
            return GenericErr;
        }
    }
}

export default Initial;