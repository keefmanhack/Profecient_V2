import React, {useState} from 'react';
import ReactPasswordStrength from 'react-password-strength';

import Loader from '../../Components/Shared Resources/Effects/Loader/loader';
import {FadeInOutHandleState} from '../../Components/Shared Resources/Effects/CustomTransition';
import MessageFlasher from '../../Components/Shared Resources/MessageFlasher';
import AbsractError from '../../Components/Shared Resources/Messages/Error Messages/AbsractError';

function ResetPasswordForm(props){
    const [passwordObj, setPasswordObj] = useState({isValid: false, password: ''});
    const [repPassword, setRepPassword] = useState('');
    const [error, setError] = useState({input: false, notValid: false, notEqual: false});
    const [acting, setActing] = useState(false);

    const submitForm = async () => {
        if(!isError()){
            setActing(true);
            const res = await props.uV.resetPassword(props.data.email, props.data.code, passwordObj.password);
            props.handleResponse(res, {password: passwordObj.password}, null);
            setActing(false);
        }
 
    }

    const isError = () => {
        const e = error;
        e.input = passwordObj.password === '';
        e.notEqual = passwordObj.password !== repPassword;
        e.notValid = !passwordObj.isValid;

        setError(e);
        return e.input || e.notEqual || e.notValid;
    }

    return(
        <div className='reset-password-form'>
            {acting? <Loader/> :null}
            <h4>Reset your <strong>password</strong>.</h4>
            <form onSubmit={(e) => e.preventDefault()}>
                <ReactPasswordStrength
                    className="password"
                    minLength={5}
                    minScore={2}
                    style={error.input ? {border: '1px solid red', transition: '.3s'} : null}
                    scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                    changeCallback={(passwordObj) => passwordObj.isValid ? setPasswordObj(passwordObj) : () => {}}
                    inputProps={{ name: "password_input", autoComplete: "off", className: "form-control sans-font", placeholder:'Password'}}
                />
                <FadeInOutHandleState condition={passwordObj.password !== repPassword}>
                    <h5 className='red-c error'><i class="fas fa-times-circle"></i> The passwords don't match</h5>
                </FadeInOutHandleState>
                <input 
                    onChange={(e) => setRepPassword(e.target.value)} 
                    type="password"
                    className='rep-password'
                    placeholder='Retype Password'
                />
                <button onClick={() => submitForm()} className='green-bc white-c'>Reset Password</button>
            </form>
        </div>
    )
}

export default ResetPasswordForm;