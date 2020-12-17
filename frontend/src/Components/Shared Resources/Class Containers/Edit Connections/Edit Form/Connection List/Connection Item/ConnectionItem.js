import React, { useState } from 'react';

import CheckBox from '../../../../../Check Box/CheckBox';
import AssignmentContainer from '../../../../Assignment Container/AssignmentContainer';

function ConnectionItem(props){
    return(
        <div className='connection-item'>
            <div>
                <CheckBox
                    onCheck={()=>{}}
                    defaultCheck={props.selected}
                    onCheck={() => props.onSelected()}
                />
            </div>
            <div>
                <UserInformation profilePictureURL={props.user.profilePictureURL} name={props.user.name}/>
            </div>
            <div>
                <ClassInformation userID={props.user._id} classData={props.classData}/>
            </div>
        </div>
    )
}

function ClassInformation(props){
    const [seeMore, setSeeMore] = useState(false);

    return(
        <div>
            {seeMore ? 
                <AssignmentContainer
                    name={props.classData.name}
                    instructor={props.classData.instructor}
                    location={props.classData.location}
                    daysOfWeek={props.classData.daysOfWeek}
                    time={props.classData.time}
                    classID={props.classData._id}
                    assignmentIDs={props.classData.assignments}
                    userID={props.userID}
                />
            :
                <h5>{props.classData.name}</h5>
            }
            <SeeMoreToggler setSeeMore={(b) =>setSeeMore(b)} seeMore={seeMore}/>
        </div>
    )
}

function SeeMoreToggler(props){
    return props.seeMore ?
        <button onClick={() => props.setSeeMore(true)}>See More</button>
    :
        <button onClick={() => props.setSeeMore(false)}>See Less</button>
}

function UserInformation(props){
    return(
        <div className='user-information'>
            <img 
                src={props.profilePictureURL ? props.profilePictureURL : '/generic_person.jpg'} 
                alt=""
                onError={(e)=>{e.target.onerrror=null; e.target.src="/generic_person.jpg"}}
            />
            <h5>{props.name}</h5>
        </div>
    )
}

export default ConnectionItem;