import React, {useState} from 'react';

import './index.css';
function CheckBox(props){
    const [checked, setChecked] = useState(props.defaultCheck);
    const handleClick=()=>{
        const t = !checked;
        setChecked(t);
        props.onCheck(t);
    }
    if(props.defaultCheck!==checked){
        setChecked(props.defaultCheck);
    }

    return(
        <button onClick={() => handleClick()} className={checked ? 'blue-bc checkbox' : 'checkbox inset-shadow'}>
            {!checked ?
                <i class="fas"></i>
            :
                <i class="fas fa-check white-c"></i>
            }
        </button>
    )
}

export default CheckBox;