import React from 'react';
import {FlipInOut, FadeInOut_HandleState} from '../../../Shared Resources/Effects/CustomTransition';

class SuggestedLinksContainer extends React.Component{

	render(){
		//creates links
		const suggestedLinks = this.props.suggestedUserLinks.map((link, index) => {
			if(!this.props.currentLinks.includes(link)){
				return <Link toggleLink={() => this.props.addLink(index)} isLinked={false} key={index} user={link.user} data={link.class}/>
			}
		})

		const existingLinks = this.props.currentLinks.map((link, index) =>
				<Link toggleLink={() => this.props.removeLink(index)} isLinked={true} key={index} user={link.user} data={link.class}/>
			)

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
	const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

	const daySpans = days.map((day, index)=>
		<span style={props.data.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
	);

	return(
		<div className='link'>
			<h1>{props.data.name}</h1>
			<h5>{props.data.links.length} Links</h5>
			<h2>{props.data.location}</h2>
			<h3>{props.data.instructor}</h3>
			<div className='week-days'>
				{daySpans}
			</div>
			<div className='user'>
				<img src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.user.profilePictureURL} alt=""/>
				<a href=''>{props.user.name}</a>
				<h5>{0} Classmates Link to this Profile</h5>
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
					<h5>{0} Links</h5>
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