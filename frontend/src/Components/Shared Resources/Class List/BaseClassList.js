import React, { useEffect, useState } from 'react';

import ClassRequests from '../../../APIRequests/Class';

import MessageFlasher from '../MessageFlasher';
import AbsractError from '../Messages/Error Messages/AbsractError';
import Loader from '../Effects/Loader/loader';

import './index.css';
function BaseClassList(props){
    const classReq = new ClassRequests(props.userID);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    console.log(props.semID);
    useEffect(() => {
        getClasses();
    }, [props.semID, props.reload, props.userID]);


    const getClasses = async () => {
        if(!props.semID){return}
        setIsLoading(true);
        const res = await classReq.getClassesBySemester(props.semID);
        setIsLoading(false);
        if(res.success){
            props.setClasses(res.classes);
        }else{
            setErrMsg(res.error);
        }
    }

    return(
        <div className='class-list'>
            {isLoading ? <Loader/> : null}
            <MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>
            {props.containers}
            {props.containers.length === 0 ? 
                <div className='light-grey-bc animate__animated animate__faster animate__fadeIn' style={{textAlign: 'center', borderRadius:5}}>
                    <p className='white-c'>You don't have any classes</p>
                </div>
            : null}
        </div>
    )
}

export default BaseClassList;