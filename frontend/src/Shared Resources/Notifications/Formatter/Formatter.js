import React from 'react';

import formatMap from './formatMap';

class Formatter{
    static format(list, notifReq, reloadNotif){
        if(!list){return []}
        let notifList = [];
        for(let i =0; i< list.length; i++){
            const Notif = formatMap.get(list[i].type);
            const renderedNotif = <Notif 
                removeNotif={() => {notifReq.delete(list[i]._id); reloadNotif()}}
                data={list[i]} 
                key={i}
            />
            notifList.push(renderedNotif);
        }
        return notifList;
    }
}

export default Formatter;