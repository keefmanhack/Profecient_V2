import React from 'react';
import {Link} from 'react-router-dom';

import RequestForm from './Forms/RequestForm';

import AbstractError from '../Components/Shared Resources/Messages/Error Messages/AbsractError';
import AbsractSuccess from '../Components/Shared Resources/Messages/Success Messages/AbsractSuccess';

import UserVerifier from '../APIRequests/User Verifier/UserVerifier';


import { FadeDownUpHandleState} from '../Components/Shared Resources/Effects/CustomTransition';
import MessageFlasher from '../Components/Shared Resources/MessageFlasher';

import './index.css';


class ForgotPassword extends React.Component{
    constructor(props){
        super(props);

        this.uV = new UserVerifier();


        this.state={
            showMessage: false,
            currentForm: RequestForm,
            resMessage: null,
            data: {
                email: null,
                code: null,
                password: null,
            }
        }
    }

    handleResponse(res, data, next){
        let d;
        let form = this.state.currentForm;
        if(res.success){
            d = this.state.data;
            for(let key in data){
                d[key] = data[key];
            }
            if(next){form = next;}
        }
        this.setState({data: d, resMessage: res, currentForm: form});
        
        if(!next){setTimeout(function(){
            this.props.history.push('/login')
        }.bind(this), 1500)};
    }

    render(){
        let message;
        if(this.state.message){
            if(this.state.message.success){
                message = <AbsractSuccess successMessage={this.state.resMessage.message} />;
            }else{
                message = <AbstractError errorMessage={this.state.resMessage.error}/>;
            }
        }

        const Form = this.state.currentForm;
        return(
            <div className='blue-to-green-bc mont-font forgot-password'>
                <Link className='mont-font blue-c header-tag' to="/">Proficient</Link>
                <MessageFlasher 
                    condition={this.state.resMessage} 
                    resetter={() => this.setState({resMessage: null})}
                    animation={FadeDownUpHandleState}
                >   
                    <React.Fragment>
                        {message}
                    </React.Fragment>
                </MessageFlasher>
                <div className='main'>
                    <h1>Reset Password</h1>
                    <hr/>
                    <Form 
                        uV={this.uV} 
                        handleResponse={(res, data, next) => this.handleResponse(res, data, next)}
                        data={this.state.data}
                    />
                </div>
                <Link id='footer-tag'>A Gregoire Design Production</Link>
            </div>
        )
    }
}


export default ForgotPassword;