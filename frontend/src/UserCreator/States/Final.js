/* 
Fake Interface
--------------
isValid()
handleError()
getNextState()
*/
import errors from '../ErrorCodes';

class Final{
    constructor(){
        this.nextState=null;
        this.validation = '';
    }

    getNextState(){
        return this.nextState;
    }

    async isValid(user){
        // this.validation = await UserService.isUserValid(user);
        return this.validation.isValid;
    }

    handleError(){
        if(this.validation.errorCode === errors.EMAIL_EXISTS){

        }else if(this.validation.errorCode === errors.PHONE_NUMBER_EXISTS){

        }else{
            //handle unknown error
        }
    }
}

export default Final;