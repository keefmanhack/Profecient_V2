import React, {useState} from 'react';
import moment from 'moment';

import Loader from '../../Effects/Loader/loader';

import './index.css';

function Notification(props){
    const [isActing, setActing] = useState(false);

    const removeNotif = async () => {
        setActing(true);
        props.removeNotif();
    }

    return(
        <div className={'notif black-bc mont-font ' + props.notifType}>
            {isActing ? <Loader/>: null}
            <button className='remove red-c' onClick={() => removeNotif()}>Dismiss</button>
            <h1>{props.notifName}</h1>
            {props.interaction}
            <div> 
                {props.mainData}
            </div>
            <div>
                {props.auxData}
            </div>
            <h3 className='time-stamp'>{moment(props.timeStamp).fromNow()}</h3>
        </div>
    )
}

export default Notification;