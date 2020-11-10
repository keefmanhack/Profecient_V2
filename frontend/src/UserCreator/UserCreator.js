import Initial from './States/Initial';
import Final from './States/Final';
import UserVerifier from '../APIRequests/UserVerifier';
import { setTokens } from '../Authentication/Tokens';

class UserCreator{
    constructor(history){
        this.user = {
            name: null,
            phoneNumber: null,
            email: null,
            password: null,
            username: null,
            profilePictureData: null,
            school: {
                name: null,
                logoURL: null,
            }
        }
        this.error = false;
        this.state = new Initial();
        this.finalState = Final;
        this.userVerifier = new UserVerifier();
        this.history = history;
    }

    getComponent(){
        return this.state.getComponent();
    }

    async handleEvent(data){
        const isValid = await this.state.isValid(data);
        this.error = !isValid;
        if(isValid){
            this.updateUser(data);
            if(!(this.state instanceof this.finalState)){
                this.state = this.state.getNextState();
            }else{
                const res = await this.loginUser();
            }
        }
    }
    
    async loginUser(){
        try{
            let res = await this.userVerifier.createUser(this.user);
            if(!res.success){
                this.state = new Initial();
                this.error = true;
                return false
            }
            res = await this.userVerifier.login(this.user.username, this.user.password);
            if(res.success){
                setTokens(res.tokens);
                this.history.push('/home');
            }
        }catch(err){
            console.log(err);
            this.state = new Initial();
            this.error = true;
            return false
        }
    }

    getErrorComponent(){
        return this.state.handleError();
    }

    hasError(){
        return this.error;
    }

    updateUser(data){
        for(let x in data){
            this.user[x] = data[x];
        }
    }
}

export default UserCreator;