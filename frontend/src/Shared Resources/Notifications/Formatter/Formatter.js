import React from 'react';

import formatMap from './formatMap';

class Formatter{
    static format(list, removeNotif){
        if(!list){return []}
        let notifList = [];
        for(let i =0; i< list.length; i++){
            const Notif = formatMap.get(list[i].type);
            const renderedNotif = <Notif 
                removeNotif={() => removeNotif(list[i]._id)}
                data={list[i]} 
                key={list[i]._id}
            />
            notifList.push(renderedNotif);
        }
        return notifList;
    }
}

export default Formatter;