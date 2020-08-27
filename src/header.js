import React from 'react';
import {Link} from "react-router-dom";

function Header(){
	return(
		<div className='top-bar black-bc' style={style_topBar}>
			<h1 className='mont-font blue-c'>Profecient</h1>
			<input className='sans-font' type='text' placeholder='Find classmates'/>
			
			<span className='not'>
				<button className='green-c'><i class="fas fa-pencil-alt"></i></button>
				<button className='green-c'><i class="fas fa-user-friends"></i></button>
				<Link to='/messages'>
					<button className='green-c'><i class="fas fa-comments"></i></button>
				</Link>
			</span>

			
			<span className='profile'>
				<img src="./generic_person.jpg" alt=""/>
				<Link to='/profilePage'>
					<button className='blue-c'><i class="fas fa-chevron-down"></i></button>
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

