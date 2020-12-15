import React, {useState, useEffect} from 'react';

import {getSelectCount, selectAllHelper, buildList, unSelectAllHelper} from './HelperFunctions';

import MessageFlasher from '../../../Shared Resources/MessageFlasher';
import AbsractError from '../../../Shared Resources/Messages/Error Messages/AbsractError';

import './index.css';
function EditConnections(props){
    const classReq = new ClassRequests(props.currUserID);
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const getConnections = async () => {
        setIsLoading(true);
        const res = await classReq.getFormatedToConnections(props.classID);
        if(res.success){
            setConnections(buildList(res.connections));
        }else{
            setErrMsg(res.error);
        }
        setIsLoading(false);
    }

    const deleteConnections =  async () => {
        setIsLoading(true);
        const res = await classReq.removeToConnections(buildIDList(connections));
        res.success ? getConnections() : setErrMsg(res.error);
        setIsLoading(false);
    }

    return(
        <div className='edit-connections'>
            <MessageFlasher resetter={() => setErrMsg('')} condition={errMsg!==''}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>

            <h1>Edit Connections</h1>
            <hr/>
            <button className='red-c'>Exit</button>
            <div>
                <Interactor
                    delete={() => deleteConnections()}
                    selectAll={() => setConnections(selectAllHelper(connections))}
                    unSelectAll={() => setConnections(unSelectAllHelper(connections))}
                    selectCount={getSelectCount(connections)}
                />
            </div>
            <ConnectionRenderer 
                isLoading={isLoading}
                connections={connections}
            />
        </div>
    )
}

function ConnectionRenderer(props){
    return props.isLoading ? <Loader/> : <ConnectionList/>;
}

export default EditConnections;