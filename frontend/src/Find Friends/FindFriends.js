import React, { useEffect, useState } from 'react';
import UserRequests from '../APIRequests/User';

import MessageFlasher from '../Components/Shared Resources/MessageFlasher';
import Loader from '../Components/Shared Resources/Effects/Loader/loader';
import { FadeDownUpHandleState } from '../Components/Shared Resources/Effects/CustomTransition';
import AbsractError from '../Components/Shared Resources/Messages/Success Messages/Error Components/AbsractError';

function FindFriends(props){
    const [users, setUsers] = useState(null);
    const [msg, setMsg] = useState('');
    const uR = new UserRequests(props.userID);

    useEffect(async () => {
        const res = await uR.findPossibleFriends();
        if(res.success){
            setUsers(res.users);
        }else{
            setMsg(res.error);
        }
    }, []);

    const foundUsers = users.map((user, index) =
        <div className='col-lg-6'>
            <User user={user} handleFollow={() => handleFollow(user._id)}/>
        </div>
    )
    return(
        <div className='find-friends'>
            <MessageFlasher condition={msg !== ''} resetter={() => setMsg('')} animation={FadeDownUpHandleState}>
                <AbsractError errorMessage={msg}/>
            </MessageFlasher>
            {!users ? <Loader/> : 
                <div className='row'>
                    {foundUsers}
                </div>
            }
        </div>
    ) 
}

function User(props){
    return(
        <div className='user'>
            <img src={props.user.profilePictureURL ? props.user.profilePictureURL : '/generic_person.jpg'}/>
            <h1>{props.user.name}</h1>
            <button onClick={() => props.handleFollow()}>Follow</button>
        </div>
    )
}