export function getSelectCount(connMap){
    return getSelectedIDs.length;
}

export function selectAllHelper(connMap){
    return setAll(connMap, true);
}

export function unSelectAllHelper(connMap){
    return setAll(connMap, false);
}

function setAll(connMap, val){
    const copy = connMap;
    for (let [key, value] of copy) {
        value.selected = val;
        copy.set(key, value);
    }
    return copy
}

export function getSelectedIDs(connMap){
    let returnArr =[];

    for (let [key, value] of connMap) {
        if(connMap.get(key).selected){
            returnArr.push(key);
        }
    }
    return returnArr;
}