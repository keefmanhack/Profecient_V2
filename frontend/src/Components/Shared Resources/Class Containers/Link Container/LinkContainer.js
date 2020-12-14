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
    const reqClassID = isLinked(props.connectionsFrom, props.currentUserID);
    return(
        reqClassID ?  
            <UnLinkButton
                reload={()=>props.reload()}
                recvUserID={props.otherUserID}
                recvClassID={props.classData._id}
                reqUserID={props.currentUserID}
                reqClassID={reqClassID}
            /> 
        : 
            <LinkButton 
                reload={()=>props.reload()}
                otherUserID={props.otherUserID}
                classData={props.classData}
                currentUserID={props.currentUserID}
            />
    )
}

function isLinked(connectionsFrom, userID){
    for(let i =0; i<connectionsFrom.length; i++){
        const id = connectionsFrom[i].userID;
        if(id + '' ===  userID + ''){return connectionsFrom[i].classID}
    }

    return false;
}

function UnLinkButton(props){
    const classReq = new ClassRequests(props.reqUserID);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const removeLink = async () => {
        setLoading(true);
        const res = await classReq.removeAConnection(props.recvUserID, props.recvClassID, props.reqClassID);
        if(res.success){
           props.reload(); 
        }else{
            setErrMsg(res.error);
        }
        setLoading(false);
    }
    return(
        <React.Fragment>
            <MessageFlasher condition={errMsg !== ''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>
            <button disabled={loading} onClick={() => removeLink()} className='link orange-bc white-c' >
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
                    linkedUserID={props.otherUserID}
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