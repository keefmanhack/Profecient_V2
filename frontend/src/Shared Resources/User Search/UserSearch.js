import React from 'react';
import {Link} from "react-router-dom";

import './usersearch.css';

function UserSearch(props){
	const searchItems = props.users && props.users.length>0 ? props.users.map((user, index) => 
			<SearchItem id={user._id} key={user._id} profilePic={user.profilePictureURL} name={user.name} school={user.school}/>
		) : null;
	return(
		<div className='user-search'>
			{searchItems}
		</div>
	)
}

function SearchItem(props){
	return(
		<Link to={'/profile/' + props.id}>
			<div className='search-item'>
				<img 
					className='person' 
					src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.profilePic} 
					alt="not found"
					onError={(e)=>{e.target.onerror = null; e.target.src="/generic_person.jpg"}}
				/>
				<h2>{props.name}</h2>
				<img 
					className='school' 
					src={props.school.logoUrl} 
					alt=""
					onError={(e)=>{e.target.onerror = null; e.target.src="/generic_school.jpg"}}
				/>
				<h3>{props.school.name}</h3>
			</div>
		</Link>
	)
}

export default UserSearch;