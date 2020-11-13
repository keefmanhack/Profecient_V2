import React, {useEffect, useState} from 'react';
import { FadeDownUpHandleState } from '../../Components/Shared Resources/Effects/CustomTransition';

import Loader from '../../Components/Shared Resources/Effects/loader';
import MessageFlasher from '../../Components/Shared Resources/MessageFlasher';
import AbsractError from '../../Components/Shared Resources/Messages/Error Messages/AbsractError';
import ResetPasswordForm from './ResetPasswordForm';

function TokenForm(props){
    const [code, setCode] = useState('');
    const [error, setError] = useState({input: false});
    const [acting, setActing] = useState(false);
    const next = ResetPasswordForm;

    const submitForm = async () => {
        if(!isError()){
            setActing(true);
            const res = await props.uV.sendPasswordUpdateCode(props.data.email, code);
            setActing(false);
            props.handleResponse(res, {code: code}, next);
        }
        
    }

    const isError = () =>{
        let e = error;
        e.input = code === '';
        mySetError(e);
        return e.input;
    }

    const mySetError = (e) => {
        setError({input: e.input});
    }
    return(
        <div className='token-form'>
            {acting? <Loader/> : null}
            <h4>Enter <strong>code</strong> sent to your inbox</h4>
            <form onSubmit={(e) => e.preventDefault()}>
                <input 
                    style={error.input ? {border: '1px solid red'}: null}
                    onChange={(e) => setCode(e.target.value)} 
                    type='text' 
                    placeholder='Code'
                />
                <button onClick={() => submitForm()} className='blue-bc'>Submit</button>
            </form>
        </div>
    )
}

export default TokenForm;