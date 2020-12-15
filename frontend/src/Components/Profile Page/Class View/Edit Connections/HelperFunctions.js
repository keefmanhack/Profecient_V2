export function getSelectCount(connectionArr){
    let ct =0;

    for(let i =0; i< connectionArr.length;i++){
        if(connectionArr[i].selected){
            ct++;
        }
    }
    return ct;
}

export function selectAllHelper(connectionArr){
    const copy = connectionArr;
    for(let i =0; i<copy.length; i++){
        copy[i].selected = true;
    }

    return copy;
}

export function unSelectAllHelper(connectionArr){
    const copy = connectionArr;
    for(let i =0; i<copy.length; i++){
        copy[i].selected = false;
    }

    return copy;
}

export function buildList(arr){
    let returnArr = [];

    for(let i =0; i<arr.length; i++){
        const t = {
            selected: false,
            _id: arr._id,
            user: arr.user,
            classData: arr.classData,
        }
        returnArr.push(t);
    }
    return returnArr;
}