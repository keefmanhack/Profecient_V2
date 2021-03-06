import React, {useState} from 'react';

import BaseClassList from './BaseClassList';
import SelectableContainer from '../Class Containers/Selectable Container/SelectableContainer';

function SelectableClassList(props){
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
                <SelectableContainer 
                    key={classData._id}
                    classData={data}
                    selected={props.selectedID + '' === classData._id + ''}
                    setSelected={(id) => props.classSelected(id)}
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

export default SelectableClassList;