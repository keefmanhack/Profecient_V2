import React, {useState, useEffect} from 'react';

import AssignmentContainer from './AssignmentContainer';
import LinkSelector from '../../../../Shared Resources/Link Selector/LinkSelector';

import ClassRequests from '../../../../../APIRequests/Class';

import {FadeInOutHandleState} from '../../../../Shared Resources/Effects/CustomTransition';
import MessageFlasher from '../../../../Shared Resources/MessageFlasher';
import AbsractError from '../../../../Shared Resources/Messages/Error Messages/AbsractError';


function LinkContainer(props){
    return(
        <AssignmentContainer
            name={props.classData.name}
            instructor={props.classData.instructor}
            location={props.classData.location}
            daysOfWeek={props.classData.daysOfWeek}
            time={props.classData.time}
            assignmentIDs={props.assignmentIDs}
            userID={props.userID}
            interaction={
                <LinkUnLinkButton 
                    reload={()=>props.reload()} 
                    connectionsFrom={props.connectionsFrom} 
                    currentUserID={props.currentUserID}
                    otherUserID={props.userID}
                    classID={props.classData._id} 
                />
            }
        />
    )
}

function LinkUnLinkButton(props){
    return isLinked(props.connectionsFrom, props.currentUserID) ?  
        <UnLinkButton/> 
    : 
        <LinkButton 
            reload={()=>props.reload()}
            otherUserID={props.otherUserID}
            classID={props.classID}
            currentUserID={props.currentUserID}
        />
}

function isLinked(connectionsFrom, userID){
    for(let i =0; i<connectionsFrom.length; i++){
        const id = connectionsFrom[i].userID;
        if(id + '' ===  userID + ''){return true}
    }

    return false;
}

function UnLinkButton(props){
    const classReq = new ClassRequests(props.otherUserID);
    const [errMsg, setErrMsg] = useState('');

    const removeLink = async () => {
        props.setLoading(true);
        const res = await classReq.removeAConnection(props.classID, props.currentUserID);
        props.setLoading(false);
        if(res.success){
           props.reload(); 
        }else{
            setErrMsg(res.error);
        }
    }
    return(
        <React.Fragment>
            <MessageFlasher condition={errMsg !== ''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>
            <button onClick={() => removeLink()} className='link orange-bc white-c' >
                UnLink
            </button>
        </React.Fragment>

    )
}

function LinkButton(props){
    const [linkSelector, setLinkSelector] = useState(null);
    const [shouldShowLinkSelector, setShouldShowLinkSelector] = useState(false);

    useEffect(() => {
        props.reload();
    }, [shouldShowLinkSelector]);

    const showLinkSelector = () => {
        const t = <LinkSelector 
                    otherUserID={props.otherUserID}
                    linkClass={props.classID}
                    currentUser={props.currentUserID}
                    hideForm={() => setShouldShowLinkSelector(false)}
        />

        setLinkSelector(t);
        shouldShowLinkSelector(true);
    }


    return(
        <React.Fragment>
            <button onClick={() => showLinkSelector()} className='link blue-bc'>
                Link
            </button>
            <FadeInOutHandleState condition={shouldShowLinkSelector}>
                {linkSelector}
            </FadeInOutHandleState>
        </React.Fragment>

    )
}

export default LinkContainer;