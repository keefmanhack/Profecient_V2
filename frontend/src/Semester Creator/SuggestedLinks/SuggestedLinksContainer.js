import React from 'react';
import {FlipInOut, FadeInOut_HandleState} from '../../CustomTransition';

class SuggestedLinksContainer extends React.Component{

	render(){
		let suggestedLinks = [];
		let existingLinks = [];
		const currLinks = this.props.currentLinks;
		//creates links
		this.props.suggestedUserLinks.forEach(function(user){
			user.semesters[0].classes.map((data, index) => {
				const isLinked = currLinks.includes(user);
				if(!isLinked){
					suggestedLinks.push(<Link toggleLink={() => this.props.addLink(index)} isLinked={isLinked} key={index} user={user} data={data}/>);
				}
				// const link = <Link toggleLink={() => this.props.toggleLink(index)} isLinked={isLinked} key={index} user={user} data={data}/>
				// !isLinked ? suggestedLinks.push(link) : null;
			})
		}.bind(this))

		if(currLinks.length>0){
			existingLinks.push(currLinks.map((user, i) =>
				user.semesters[0].classes.map((data, j) =>
					<Link toggleLink={() => this.props.removeLink(i)} isLinked={true} key={i} user={user} data={data}/>
				)
			))
		}

		return(
			<div style={this.props.style} className='suggested-links'>
				<FadeInOut_HandleState condition={suggestedLinks.length >0 || existingLinks.length >0}> 
					<React.Fragment>
						<h5>Suggested Links</h5>
						<hr/>
						{suggestedLinks}
						<h5>Existing Links</h5>
						<hr/>
						{existingLinks}
					</React.Fragment>
				</FadeInOut_HandleState>
				<FadeInOut_HandleState condition={suggestedLinks.length <1 && existingLinks.length <1}>
					<p>No links match this class</p>
				</FadeInOut_HandleState>
			</div>
		)
	}
}

class Link extends React.Component{
	constructor(props){
		super(props);

		this.state={
			isExpanded: false,
		}
	}

	toggleExpanded(){
		const isExpandedCopy = this.state.isExpanded;

		this.setState({
			isExpanded: !isExpandedCopy
		})
	}

	render(){
		const display = this.state.isExpanded ? 
						<ExpandedLink 
							data={this.props.data} 
							user={this.props.user}
							isLinked={this.props.isLinked}
							toggleExpanded={() => this.toggleExpanded()}
							toggleLink={() => this.props.toggleLink()}
						/> 
						: 
						<ShortLink 
							data={this.props.data} 
							user={this.props.user}
							isLinked={this.props.isLinked}
							toggleExpanded={() => this.toggleExpanded()}
							toggleLink={() => this.props.toggleLink()}
						/>
		return(
			<React.Fragment>
				<FlipInOut condition={this.state.isExpanded}>
					{display}
				</FlipInOut>
			</React.Fragment>
		);
	}
}

function ExpandedLink(props){
	return(
		<div className='link'>
			<h1>{props.data.name}</h1>
			<h5>{props.data.links.length} Links</h5>
			<h2>{props.data.location}</h2>
			<h3>{props.data.instructor}</h3>
			<div className='week-days'>
				<span className={props.data.weekDays.monday ? 'active' : null}>M</span>
				<span className={props.data.weekDays.tuesday ? 'active' : null}>T</span>
				<span className={props.data.weekDays.wednesday ? 'active' : null}>W</span>
				<span className={props.data.weekDays.thursday ? 'active' : null}>T</span>
				<span className={props.data.weekDays.friday ? 'active' : null}>F</span>
				<span className={props.data.weekDays.saturday ? 'active' : null}>S</span>
				<span className={props.data.weekDays.sunday ? 'active' : null}>S</span>
			</div>
			<div className='user'>
				<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.user.profilePictureURL} alt=""/>
				<a href=''>{props.user.name}</a>
				<h5>{props.user.totalLinks} Classmates Link to this Profile</h5>
			</div>
			<button style={props.isLinked ? {background: 'red'} : null} onClick={() => props.toggleLink()}>
				{props.isLinked ?
					<React.Fragment><i class="fas fa-minus-square"></i> <span>Unlink</span> </React.Fragment>
				:
					<React.Fragment><i class="fas fa-plus-square"></i> <span>Link</span> </React.Fragment>
				}
			</button>
			<button onClick={() => props.toggleExpanded()} className='drop-down'><i class="fas fa-caret-down"></i></button>
		</div>
	)
}

function ShortLink(props){
	return(
		<div className='short-link link'>
			<div className='row'>
				<div className='col-lg-8'>

					<h1>{props.data.name}</h1>
					<h5>{props.data.links} Links</h5>
					<a href=''>{props.user.name}</a>
				</div>
				<div className='col-lg-4'>
					<button style={props.isLinked ? {background: 'red'} : null} onClick={() => props.toggleLink()}>
						{props.isLinked ?
							<React.Fragment><i class="fas fa-minus-square"></i> <span>Unlink</span> </React.Fragment>
						:
							<React.Fragment><i class="fas fa-plus-square"></i> <span>Link</span> </React.Fragment>
						}
					</button>
				</div>
			</div>
			<button onClick={() => props.toggleExpanded()} className='drop-down'><i class="fas fa-caret-up"></i></button>
		</div>
	);
}

export default SuggestedLinksContainer;