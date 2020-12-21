import React, {useState, useEffect} from 'react';

import EditConnectionsContainer from '../Class Containers/Edit Connections/EditConnectionsContainer';
import BaseClassList from './BaseClassList';

function ManageConnectionClassList(props){
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
                <EditConnectionsContainer
                    classData={data}
                    currentUserID={props.currentUserID}    
                    assignmentIDs={classData.assignments}
                    key={classData._id}
                />
            )
        return container;
    })

    return(
        <BaseClassList
            setClasses={(classes) => setClasses(classes)}
            containers={containers}
            semID={props.semID}
            userID={props.userID}
        />
    )
}

export default ManageConnectionClassList;