import React from 'react';

import AbstractError from '../AbsractError';

function UserNameErr(props){
    return(
        <AbstractError 
            errorMessage={<span>This <strong>username</strong> already exists</span>}
        />
    ) 
}

export default UserNameErr;