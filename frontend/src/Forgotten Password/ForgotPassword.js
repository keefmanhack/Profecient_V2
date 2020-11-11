import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ReactPasswordStrength from 'react-password-strength';

import {emailTester} from '../Authentication/RegexTesters';

import EmailNotExist from '../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/EmailNotExist';
import GenericErr from '../Components/Login Landing/Landing-UserCreator/Error Components/Concrete Errors/GenericErr';
import AbstractError from '../Components/Login Landing/Landing-UserCreator/Error Components/AbsractError';

import { FadeDownUpHandleState, FadeInOutHandleState } from '../Components/Shared Resources/Effects/CustomTransition';
import MessageFlasher from '../Components/Shared Resources/MessageFlasher';

import './index.css';

class ForgotPassword extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showMessage: false,
        }
    }
    render(){
        return(
            <div className='blue-to-green-bc mont-font forgot-password'>
                <Link className='mont-font blue-c header-tag' to="/">Proficient</Link>
                <div className='main'>
                    <h1>Reset Password</h1>
                    <hr/>
                    <MessageFlasher condition={this.state.showMessage} resetter={() => this.setState({showMessage: false})}>
                        <FadeDownUpHandleState condition={this.state.flash}>
                            <h1>This is some text</h1>
                        </FadeDownUpHandleState>
                    </MessageFlasher>
                    {/* <RequestForm/> */}
                    {/* <TokenForm/> */}
                    <ResetPasswordForm/>
                </div>
                <Link id='footer-tag'>A Gregoire Design Production</Link>
            </div>
        )
    }
}

function ResetPasswordForm(props){
    const [passwordObj, setPasswordObj] = useState({isValid: false, password: ''});
    const [repPassword, setRepPassword] = useState('');
    const [error, setError] = useState({input: false, notEqual: false, genericError: false});

    const submitForm = () => {

    }

    return(
        <div className='reset-password-form'>
            <h4>Reset your <strong>password</strong>.</h4>
            <form>
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

function TokenForm(props){
    const [code, setCode] = useState(null);
    const [error, setError] = useState({input: false, genericError: false});

    const submitForm = async () => {
        if(!isError()){
            const res = await props.uV.sendPasswordUpdate(code);
            if(res.success){
                props.next();
            }else{
                const e = error;
                e.genericError=true;
                setError(e);
            }
        }
    }

    const isError = () =>{
        const e = error;
        e.input = !!code;
        setError(e);
        return e.input;
    }

    return(
        <div className='token-form'>
            <MessageFlasher condition={error.genericError} resetter={() => {const e = error; e.genericError=false; setError(e)}}>
                <FadeDownUpHandleState condition={error.genericError}>
                    <AbstractError errorMessage={<span>Double check the <strong>code</strong>.</span>}/>
                </FadeDownUpHandleState>
            </MessageFlasher>
            <h4>Enter <strong>code</strong> sent to your inbox</h4>
            <form>
                <input 
                    style={error.input? {border: '1px solid'}: null}
                    onChange={(e) => setCode(e.target.value)} 
                    type='number' 
                    placeholder='Code'
                />
                <button onClick={() => submitForm()} className='blue-bc'>Submit</button>
            </form>
        </div>
    )
}

function RequestForm(props){
    let [email, setEmail] = useState('');
    let [error, setError] = useState({input: false, doesntExist: false, genericError: false});
    
    const submitForm = async () => {
        if(!isError){
            const res = await props.uV.sendPasswordUpdateEmail(email);
            if(res.success){
                props.next();
            }else{
                const e = error;
                e.genericError=true;
                setError(e);
            }
        }
    }

    const isError = async () => {
        const errorCopy = error;
        const e = !emailTester(email);
        if(!e){
            const res = await props.uV.verifyEmail(email);
            if(!res.exists){
                errorCopy.doesntExist = true;
            }else{
                errorCopy.doesntExist = false;
            }
        }
        errorCopy.input = e;
        setError(errorCopy);
        return e;
    }

    return(
        <div className='request-form'>
            <MessageFlasher condition={error.doesntExist} resetter={() => {const e = error; e.doesntExist=false; setError(e)}}>
                <FadeDownUpHandleState condition={error.doesntExist}>
                    <EmailNotExist/>
                </FadeDownUpHandleState>
            </MessageFlasher>

            <MessageFlasher condition={error.genericError} resetter={() => {const e = error; e.genericError=false; setError(e)}}>
                <FadeDownUpHandleState condition={error.genericError}>
                    <GenericErr/>
                </FadeDownUpHandleState>
            </MessageFlasher>
            <h4>Enter the <strong>email</strong> used for your account.</h4>
            <form>
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

export default ForgotPassword;