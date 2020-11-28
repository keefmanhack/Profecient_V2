import React, { useEffect, useState } from 'react';

import OwnedContainer from './Class Containers/OwnedContainer';
import LinkContainer from './Class Containers/LinkContainer';

import ClassRequests from '../../../../APIRequests/Class';

import MessageFlasher from '../../../Shared Resources/MessageFlasher';
import AbsractError from '../../../Shared Resources/Messages/Error Messages/AbsractError';
import Loader from '../../../Shared Resources/Effects/Loader/loader';

import './index.css';
function ClassList(props){
    const classReq = new ClassRequests(props.otherUserID);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        getClasses();
    }, []);

    const getClasses = async () => {
        setIsLoading(true);
        const res = await classReq.getCurrent();
        setIsLoading(false);
        if(res.success){
            setClasses(res.classes)
        }else{
            setErrMsg(res.error);
        }
    }

    const containers = classes.map(classData =>
        props.isCurrentUserViewing ? 
            <OwnedContainer 
                name={classData.name}
                instructor={classData.instructor}
                location={classData.location}
                daysOfWeek={classData.daysOfWeek}
                time={classData.time}
                classID={classData._id}
                currentUserID={props.currentUserID}    
                assignmentIDs={classData.assignments} 
                currentUserID={props.currentUserID}
            />
        :
            <LinkContainer 
                name={classData.name}
                instructor={classData.instructor}
                location={classData.location}
                daysOfWeek={classData.daysOfWeek}
                time={classData.time}
                classID={classData._id}
                currentUserID={props.currentUserID}    
                assignmentIDs={classData.assignments} 
                currentUserID={props.currentUserID}
            />
    )
    return(
        <div className='class-list'>
            {isLoading ? <Loader/> : null}
            <MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>
            {containers}
            {containers.length === 0 ? 
                <div className='light-grey-bc animate__animated animate__faster animate__fadeIn' style={{textAlign: 'center', borderRadius:5}}>
                    <p className='white-c'>You don't have any classes</p>
                </div>
            : null}
        </div>
    )
}

export default ClassList;