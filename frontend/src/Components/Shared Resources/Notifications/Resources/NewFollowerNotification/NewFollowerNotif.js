import React from 'react';
import {Link} from "react-router-dom";

import Notification from '../../Abstract Notification/AbstractNotification';

import './index.css';

function NewFollowerNotification(props){
    return(
        <Notification
            notifType={'NewFollower'}
            notifName={'New Follower'}
            removeNotif={() => props.removeNotif()}
            interaction={null}
            mainData={
                <Link to={'/profile/' + props.data.followerID}>
                    <span className='other-user'>
                        <img 
                            src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.data.profilePictureURL} 
                            alt=""
                            onError={(e) => {e.target.onerror=null; e.target.src="/generic_person.jpg"}}
                        />
                        {props.data.name}
                    </span>
			    </Link>
            }
            auxData={
                props.data.schoolLogoURL && props.data.schoolName ?
                    <div className='school'> 
                        <img 
                            src={props.data.schoolLogoURL ? props.data.schoolLogoURL : '/generic_school.jpg'} 
                            alt=""
                            onError={(e) => {e.target.onerror=null; e.target.src="/generic_school.jpg"}}
                        />
                        <h3>{props.data.schoolName}</h3>
                    </div>
                : null
            }
            timeStamp={props.data.timeStamp}
        />
    )
}

export default NewFollowerNotification;