import React, {useState} from 'react';

import BaseClassList from './BaseClassList';
import LinkContainer from '../Class Containers/LinkContainer';

function ToggleLinkClassList(props){
    const [classes, setClasses] = useState([]);

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
                    reload={() => {}}
                />
            )
        return container;
    })

    return(
        <BaseClassList
            setClasses={(classes) => setClasses(classes)}
            containers={containers}
            semID={props.semID}
        />
    )
}

export default ToggleLinkClassList;