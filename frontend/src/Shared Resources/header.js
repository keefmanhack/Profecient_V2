import React from 'react';
import {Link} from "react-router-dom";

import './header.css';

function Header(props){
	const acNotes = props.currentUser.notifications.academic.unDismissed;
	return(
		<div className='top-bar black-bc' style={style_topBar}>
			<Link to='/home'>
				<h1 className='mont-font blue-c'>Profecient</h1>
			</Link>
			<input className='sans-font' type='text' placeholder='Find classmates'/>
			
			<span className='not'>
				<span>
					<button className='green-c off-black-bc'><i className="fas fa-pencil-alt"></i></button>
					<button className='drop-down off-black-bc'><i className="fas fa-chevron-down"></i></button>
					{acNotes > 0 ? <h5>{acNotes}</h5> : null}
				</span>
				
				<button className='green-c off-black-bc'><i className="fas fa-user-friends"></i></button>
				<Link to='/message'>
					<button className='green-c off-black-bc'><i className="fas fa-comments"></i></button>
				</Link>
			</span>

			
			<span className='profile'>
				<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.currentUser.profilePictureURL} alt=""/>
				<Link to={'/profile/' + props.currentUser._id}>
					<button className='blue-c'><i className="fas fa-chevron-down"></i></button>
				</Link>
			</span>

		</div>
	);
}

const style_topBar = {
	paddingTop: 10,
	paddingLeft: 40,
	paddingRight: 40
}

export default Header;

