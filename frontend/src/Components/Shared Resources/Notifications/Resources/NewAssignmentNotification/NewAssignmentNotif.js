import React from 'react';
import {Link} from "react-router-dom";
import moment from 'moment';

import Notification from '../../Abstract Notification/AbstractNotification';

import './index.css';

function NewAssignmentNotification(props){
    return(
        <Notification
            notifType={'New-Assignment'}
            notifName={'New Assignment'}
            removeNotif={() => props.removeNotif()}
            interaction={null}
            mainData={
                <div>
                    <h3>{props.data.assignment.parentClassName}</h3>
                    <Link to={'/profile/' + props.data.user._id}>
                        <span className='other-user'>
                            <img 
                                src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.data.user.profilePictureURL} 
                                alt=""
                                onError={(e) => {e.target.onerror=null; e.target.src="/generic_person.jpg"}}
                            />
                            {props.data.user.name}
                        </span>
			        </Link>
                    {props.data.user.schoolLogoURL && props.data.user.schoolName ?
                        <div className='school'> 
                            <img 
                                src={props.data.user.schoolLogoURL ? props.data.user.schoolLogoURL : '/generic_school.jpg'} 
                                alt=""
                                onError={(e) => {e.target.onerror=null; e.target.src="/generic_school.jpg"}}
                            />
                            <h3>{props.data.user.schoolName}</h3>
                        </div>
                    : null}
                </div>
            }
            auxData={
                <div className='assignment'>
                    <h2 className='green-c'>{props.data.assignment.name}</h2>
                    <h3>{moment(props.data.assignment.dueDate).format("MMM Do YY")}</h3>
                    {props.data.assignment.description ? <hr/> : null}
                    <p>{props.data.assignment.description}</p>
                </div>
            }
            timeStamp={props.data.timeStamp}
        />
    )
}

export default NewAssignmentNotification;