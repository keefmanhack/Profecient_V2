/* 
Fake Interface
--------------
isValid()
handleError()
getNextState()
*/
import errors from '../../APIRequests/User Verifier/ErrorCodes';
import LandingPage2 from '../../Components/Login Landing/Landing-UserCreator/States/Final/Final';
import UserRequests from '../../APIRequests/User';
import GenericErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/GenericErr';
import UserNameErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/UserNameErr';

import UserVerifier from '../../APIRequests/User Verifier/UserVerifier';

class Final{
    constructor(){
        this.nextState= null; //new SemesterCreator();
        this.validation = null;
        this.component= LandingPage2;
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
            this.validation = await this.userVerifier.verifyUserName(user.username);
            if(this.validation.exists){
                return false;
            }
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    handleError(){
        if(!this.validation){return GenericErr}
        if(this.validation.errorCode === errors.USERNAME_EXISTS){
            return UserNameErr;
        }else{
            return GenericErr;
        }
    }
}

export default Final;