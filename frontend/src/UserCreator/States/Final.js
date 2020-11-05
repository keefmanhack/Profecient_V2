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

class Final{
    constructor(){
        this.nextState=null;
        this.validation = null;
        this.component= LandingPage2;
        this.userReq = new UserRequests(null);
    }

    getNextState(){
        return this.nextState;
    }

    async isValid(user){
        // this.validation = await UserService.isUserValid(user);
        return this.validation.isValid;
    }

    handleError(){
        // if(this.validation.errorCode === errors.EMAIL_EXISTS){

        // }else if(this.validation.errorCode === errors.PHONE_NUMBER_EXISTS){

        // }else{
        //     //handle unknown error
        // }
    }
}

export default Final;