import React from 'react';

import ConnectionItem from './Connection Item/ConnectionItem';

import './index.css';
function ConnectionList(props){
    let connectionItems = [];
    for (let [key, value] of props.connections) {
        const t = <ConnectionItem
            key={key}
            selected={value.selected}
            user={value.user}
            classData={value.classData}
            onSelected={(b) => props.onSelected(key, b)}
        />
        connectionItems.push(t);
    }

    return(
        <div className='connection-list light-grey-bc'>
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