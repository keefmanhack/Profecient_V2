import React from 'react';
import Landing from './States/Initial/landing';
import UserCreator from '../../../UserCreator/UserCreator';

import Loader from '../../Shared Resources/Effects/loader';
import { FadeInOutHandleState } from '../../Shared Resources/Effects/CustomTransition';

class OnBoard extends React.Component{
    constructor(props){
        super(props);
        this.uc = new UserCreator();
        this.state = {
            comp: this.uc.getComponent(),
            errorComp: this.uc.getErrorComponent(),
            isActing: false,
        }
        
    }

    async handleEvent(data){
        this.setState({isActing: true});
        await this.uc.handleEvent(data);
        if(this.uc.hasError()){
            this.setState({errorComp: this.uc.getErrorComponent()});
            setInterval(() => {
                this.setState({errorComp: null});
            }, 1500);
        }

        this.setState({comp: this.uc.getComponent()});
        this.setState({isActing: false});
    }

    render(){
        const Component = this.state.comp;
        const ErrorComponent = this.state.errorComp;
        return (
            <div>
                {this.state.isActing ? <Loader/> : null}
                <Component handleEvent={(data) => this.handleEvent(data)}/>
                <FadeInOutHandleState condition={this.state.errorComp}>
                    <ErrorComponent/>
                </FadeInOutHandleState>
            </div>
                
        );
    }
}

export default OnBoard;