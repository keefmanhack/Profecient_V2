import React from 'react';
import {Link} from "react-router-dom";

import './usersearch.css';

class UserSearch extends React.Component{
	constructor(props){
		super(props);

		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}
	
	componentDidMount(){
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hide();
        }
    }

	render(){
		const searchItems = this.props.users && this.props.users.length>0 ? this.props.users.map((user, index) => {
			if(validUser(user)){
				return (<SearchItem handleClick={() => this.props.hide()} id={user._id} key={user._id} profilePic={user.profilePictureURL} name={user.name} schoolName={user.schoolName} schoolLogoURL={user.schoolLogoURL}/>)
			}		
		}) : null;
		return(
			<div ref={this.wrapperRef} className='user-search'>
				{searchItems}
			</div>
		)
	}
}

function SearchItem(props){
	return(
		<Link to={'/profile/' + props.id}>
			<div onClick={() => props.handleClick()} className='search-item'>
				<img 
					className='person' 
					src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.profilePic} 
					alt="not found"
					onError={(e)=>{e.target.src="/generic_person.jpg"}}
				/>
				<h2>{props.name}</h2>
				{props.schoolName && props.schoolLogoURL ?
					<React.Fragment>
						<img 
							className='school' 
							src={props.schoolLogoURL ? props.schoolLogoURL : '/generic_school.jpg'} 
							alt=""
							onError={(e)=>{e.target.onerrror=null; e.target.src="/generic_school.jpg"}}
						/>
						<h3>{props.schoolName}</h3>
					</React.Fragment>
				: null}
			</div>
		</Link>
	)
}

function validUser(user){
	if(!user.name){
		return false;
	}
	return true;
}

export default UserSearch;