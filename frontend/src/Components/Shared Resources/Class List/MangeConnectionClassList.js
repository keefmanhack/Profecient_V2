import React, {useState} from 'react';

import OwnedContainer from '../Class Containers/OwnedContainer';
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
                <OwnedContainer
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
        />
    )
}

export default ManageConnectionClassList;