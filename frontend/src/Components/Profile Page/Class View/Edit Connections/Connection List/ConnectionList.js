import React from 'react';

import './index.css';
function ConnectionList(props){
    const connectionItems =  props.connections.map(connection => {
        <ConnectionItem
            key={connection._id}
            selected={connection.selected}
            user={connection.user}
            classData={connection.classData}
        />
    });

    return(
        <div className='connection-list'>
            {connectionItems.length>0 ?
                connectionItems
            :
                <NoItems/>
            }
        </div>
    )
}

function NoItems(props){
    return(
        <div className='no-items'>
            <span>No Connections for this class</span>
        </div>
    )
}

export default ConnectionList;