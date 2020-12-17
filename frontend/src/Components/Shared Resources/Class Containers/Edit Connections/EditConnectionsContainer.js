import React, {useState} from 'react';
import { FadeDownUpHandleState } from '../../Effects/CustomTransition';
import EditConnectionsForm from './Edit Form/EditConnectionsForm';
import AssignmentContainer from '../Assignment Container/AssignmentContainer';

function EditConnectionsContainer(props){
    const [showForm, setShowForm] = useState(false);
    return(
        <React.Fragment>
            <AssignmentContainer
                name={props.classData.name}
                instructor={props.classData.instructor}
                location={props.classData.location}
                daysOfWeek={props.classData.daysOfWeek}
                time={props.classData.time}
                classList={'light-green-bc'}
                currentUserID={props.currentUserID}    
                assignmentIDs={props.assignmentIDs} 
                currentUserID={props.currentUserID}
                classList={'light-green-bc'}
                interaction={
                    <button 
                        className='edit-connection white-bc blue-c' 
                        onClick={() => setShowForm(true)}>Edit Connections</button>
                }
            />
            <FadeDownUpHandleState condition={showForm}>
                <EditConnectionsForm
                    hideForm={()=>setShowForm(false)}
                    currUserID={props.currentUserID}
                    classID={props.classData._id}
                    className={props.classData.name}
                />
            </FadeDownUpHandleState>
        </React.Fragment>

    )
}

export default EditConnectionsContainer;