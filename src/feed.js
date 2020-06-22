import React from 'react';

function Feed(){
	return(
		<div className='feed'>
			<PostCreator/>
		</div>
	);
}

class PostCreator extends React.Component{
	render(){
		return(
			<div className='new-post'>
				<textarea defaultValue='text'></textarea>
			</div>
		);
	}
}

export default Feed;