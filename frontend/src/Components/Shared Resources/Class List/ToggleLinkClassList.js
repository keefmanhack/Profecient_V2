import React, {useEffect, useState} from 'react';

import BaseClassList from './BaseClassList';
import LinkContainer from '../Class Containers/Link Container/LinkContainer';

function ToggleLinkClassList(props){
    const [classes, setClasses] = useState([]);
    const [reloadKey, setReloadKey] = useState(0);


    const containers = classes.map(classData => {
        let data = 
            {
                name: classData.name,
                instructor: classData.instructor,
                location: classData.location,
                daysOfWeek: classData.daysOfWeek,
                time: classData.time,
                _id: classData._id,
            }
        const container =
            (
                <LinkContainer 
                    key={classData._id}
                    classData={data}
                    userID={props.userID}
                    assignmentIDs={classData.assignments} 
                    currentUserID={props.currentUserID}
                    connectionsFrom={classData.connectionsFrom}
                    reload={() => setReloadKey(Math.random())}
                />
            )
        return container;
    })  

    return(
        <BaseClassList
            setClasses={(classes) => setClasses(classes)}
            containers={containers}
            semID={props.semID}
            reload={reloadKey}
            userID={props.userID}
        />
    )
}

export default ToggleLinkClassList;