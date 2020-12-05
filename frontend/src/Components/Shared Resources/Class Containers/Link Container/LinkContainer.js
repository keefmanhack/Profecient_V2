import React, {useState, useEffect} from 'react';

import AssignmentContainer from '../Assignment Container/AssignmentContainer';
import LinkSelector from '../../Link Selector/LinkSelector';

import ClassRequests from '../../../../APIRequests/Class';

import {FadeInOutHandleState} from '../../Effects/CustomTransition';
import MessageFlasher from '../../MessageFlasher';
import AbsractError from '../../Messages/Error Messages/AbsractError';

import './index.css';
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
            classList={'light-green-bc'}
            interaction={
                <LinkUnLinkButton 
                    reload={()=>props.reload()} 
                    connectionsFrom={props.connectionsFrom} 
                    currentUserID={props.currentUserID}
                    otherUserID={props.userID}
                    classData={props.classData} 
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
            classData={props.classData}
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
                    linkedClass={props.classData}
                    currentUserID={props.currentUserID}
                    hideForm={() => setShouldShowLinkSelector(false)}
                />
        setLinkSelector(t);
        setShouldShowLinkSelector(true);
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