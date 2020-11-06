import Initial from './States/Initial';
import Final from './States/Final';

class UserCreator{
    constructor(){
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
    }

    getComponent(){
        return this.state.getComponent();
    }

    async handleEvent(data){
        const isValid = await this.state.isValid(data);
        this.error = !isValid;
        if(isValid){
            this.updateUser(data);
            if(this.state !== this.finalState){
                this.state = this.state.getNextState();
            }
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