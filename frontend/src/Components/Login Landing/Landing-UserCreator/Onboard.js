import React from 'react';
import UserCreator from '../../../UserCreator/UserCreator';

import Loader from '../../Shared Resources/Effects/Loader/loader';
import { FadeInOutHandleState } from '../../Shared Resources/Effects/CustomTransition';

class OnBoard extends React.Component{
    constructor(props){
        super(props);
        this.uc = new UserCreator(this.props.history);
        this.state = {
            comp: this.uc.getComponent(),
            showError: false,
            isActing: false,
        }
        
    }

    async handleEvent(data){
        this.setState({isActing: true});
        await this.uc.handleEvent(data);
        if(this.uc.hasError()){
            this.setState({showError: true});
            setTimeout(() => {
                this.setState({showError: false});
            }, 1500);
        }
        this.setState({comp: this.uc.getComponent()});
        this.setState({isActing: false});
    }

    render(){
        const Component = this.state.comp;
        const ErrorComponent = this.uc.getErrorComponent();
        const renderedError = ErrorComponent ? <ErrorComponent/> : null;
        return (
            <div>
                {this.state.isActing ? <Loader/> : null}
                <Component handleEvent={(data) => this.handleEvent(data)}/>
                <FadeInOutHandleState condition={this.state.showError}>
                    <React.Fragment>
                        {renderedError}
                    </React.Fragment>   
                </FadeInOutHandleState>
                
            </div>
                
        );
    }
}

export default OnBoard;