import React, {useState} from 'react';

import EmailNotExist from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/EmailNotExist';
import GenericErr from '../../Components/Shared Resources/Messages/Error Messages/Concrete Errors/GenericErr';

import TokenForm from './TokenForm';

import { FadeDownUpHandleState} from '../../Components/Shared Resources/Effects/CustomTransition';
import MessageFlasher from '../../Components/Shared Resources/MessageFlasher';

import errors from '../../APIRequests/User Verifier/ErrorCodes';
import {emailTester} from '../../Authentication/RegexTesters';
import Loader from '../../Components/Shared Resources/Effects/loader';

function RequestForm(props){
    const [email, setEmail] = useState('');
    const [error, setError] = useState({input: false, doesntExist: false, genericError: false});
    const [acting, setActing] = useState(false);
    const next = TokenForm;

    
    const submitForm = async () => {
        if(!(await isError())){
            const res = await props.uV.sendPasswordUpdateEmail(email);
            setActing(false);
            props.handleResponse(res, {email: email}, next);
        }
        
    }

    const isError = async () => {
        let errorCopy = error;
        const e = !emailTester(email);
        if(!e){
            setActing(true)
            const res = await props.uV.verifyEmail(email);
            if(!res.exists){
                if(res.errorCode ===  errors.NOT_CONNECTED){
                    errorCopy.genericError = true;
                }else{
                    errorCopy.doesntExist =  true;
                }
            }else{
                errorCopy.genericError = false;
                errorCopy.doesntExist = false;
            }
        }
        errorCopy.input = e;
        mySetError(errorCopy);
        return error.input || error.doesntExist || error.genericError;
    }

    const mySetError = (e) => {
        setError({input: e.input, doesntExist: e.doesntExist, genericError: e.genericError});
    }

    return(
        <div className='request-form'>
            {acting ? <Loader/> : null}
            <MessageFlasher 
                condition={error.doesntExist} 
                resetter={() => {const e = error; e.doesntExist=false; mySetError(e)}}
                animation={FadeDownUpHandleState}
            >   
                <EmailNotExist/>
            </MessageFlasher>

            <MessageFlasher 
                condition={error.genericError} 
                resetter={() => {const e = error; e.genericError = false; mySetError(e)}}
                animation={FadeDownUpHandleState}
            >
                <GenericErr/>
            </MessageFlasher>
            <h4>Enter the <strong>email</strong> used for your account.</h4>
            <form onSubmit={(e) => e.preventDefault()}>
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder='Email Address' 
                    type='email'
                    style={error.input ? {border: '1px solid red'} : null}
                />
                <button onClick={() => submitForm()} className='blue-bc'>Submit</button>
            </form>
        </div>
    )
}

export default RequestForm;