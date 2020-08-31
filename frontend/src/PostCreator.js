import React from 'react';

function PostCreator(props){
	return(
		<div className="make-post mont-font">
    		<h5><span style={{fontWeight: 600}}>{props.firstName}</span>, what happened today in class?</h5>
	        <p><span className='textarea' role='textbox' contenteditable='true'></span></p>
			<button style={{background: 'none'}} className='white-c'><i class="fas fa-camera-retro"></i></button>
			<button className='submit blue-bc'>Submit</button>
      	</div>
	);
}

export default PostCreator;