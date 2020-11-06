/* 
Fake Interface
--------------
isValid()
handleError()
getNextState()
*/
import errors from '../ErrorCodes';
import LandingPage2 from '../../Components/Login Landing/Landing-UserCreator/States/Final/Final';
import UserRequests from '../../APIRequests/User';
import GenericErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/GenericErr';
import UserNameErr from '../../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/UserNameErr';

class Final{
    constructor(){
        this.nextState=null;
        this.validation = null;
        this.component= LandingPage2;
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
            this.validation = await this.userVerifier.verifyUserName(user.username);
            if(!this.validation.isValid){
                return false;
            }
            return true;
        }catch(err){
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