import React from 'react';
import Landing from './States/Initial/landing';
import UserCreator from '../../../UserCreator/UserCreator';

class OnBoard extends React.Component{
    constructor(props){
        super(props);
        this.uc = new UserCreator();
        this.state = {
            comp: this.uc.getComponent(),
            errorComp: this.uc.getErrorComponent(),
        }
        
    }

    async handleEvent(data){
        await this.uc.handleEvent(data);
        if(this.uc.hasError()){
            this.setState({errorComp: this.uc.getErrorComponent()});
            setInterval(() => {
                this.setState({errorComp: null});
            }, 1500);
        }

        this.setState({comp: this.uc.getComponent()});
    }

    render(){
        const Component = this.state.comp;
        const ErrorComponent = this.state.errorComp;
        return (
            <div>
                <Component handleEvent={(data) => this.handleEvent(data)}/>
                {this.state.errorComp ?  <ErrorComponent/> :null}
            </div>
                
        );
    }
}

export default OnBoard;