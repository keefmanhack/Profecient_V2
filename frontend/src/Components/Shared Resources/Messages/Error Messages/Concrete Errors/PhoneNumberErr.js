import React from 'react';

import AbstractError from '../AbsractError';

function PhoneNumberErr(props){
    return(
        <AbstractError
            errorMessage={<span>An account already exists with this <strong>Phone Number</strong>.</span>}
        />
    ) 
}

export default PhoneNumberErr;