import React from 'react';

import AbstractError from '../AbsractError';

function NotConnectedErr(props){
    return(
        <AbstractError
            errorMessage={<span>Doesn't seem like you're connected to the internet.</span>}
        />
    ) 
}

export default NotConnectedErr;