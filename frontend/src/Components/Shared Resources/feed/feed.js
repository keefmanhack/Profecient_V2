import React from 'react';
import {Link} from "react-router-dom";

import {convertToStdDate} from '../../Home/Agenda/Agenda_Helper';
import {FadeInOutHandleState} from '../../Shared Resources/Effects/CustomTransition';
import MenuDropDown, {DropDownMain} from '../../Shared Resources/MenuDropDown';
import {FailedSent, SuccessCheck} from '../../Shared Resources/Effects/lottie/LottieAnimations';
import Loader from '../../Shared Resources/Effects/loader';
import ImageGallary from '../../Shared Resources/ImageGallary';

import './feed.css';

import PostRequests from '../../APIRequests/Post';

function Feed(props){
	const postReq  = new PostRequests(props.currentUser._id);

	const posts = props.feedData.length>0 ? props.feedData.map((data, index) =>
		<Post 
			data={data}
			currentUser={props.currentUser}
			postReq={postReq}
			key={data._id}
			reloadPosts={() => props.reloadPosts()}
		/>
	) : <p className='no-data'> <span role="img" aria-label="crying">😥</span> {props.noFeedDataMsg} <span role="img" aria-label="thumbs-up">👍</span></p>;

	return(
		<div className='feed white-c'>
			{posts}
		</div>
	);
}

class Post extends React.Component{
	constructor(props){
		super(props);

		this.state={
			likes: [],
			comments: [],
			showDialog: false,
			showLoader: false,
			actionSuccess: false,
			actionSuccess: false,
		}
	}

	componentDidMount(){
		this.getLikes();
		this.getComments();
	}

	async remove(){
		this.setState({showLoader: true});
		this.setState({showDialog: false});
		const res = await this.props.postReq.remove(this.props.data._id);
		this.setState({showLoader: false});
		res ? this.setState({actionSuccess: true}) : this.setState({actionFailure: true});
	}

	async getLikes(){
		this.setState({likes: await this.props.postReq.getLikes(this.props.data._id)});
	}

	async getComments(){
		this.setState({comments: await this.props.postReq.getComments(this.props.data._id)});
	}

	async toggleLike(){
		await this.props.postReq.toggleLike(this.props.data._id);
		await this.getLikes();
	}

	async newComment(text){
		await this.props.postReq.newComment(this.props.data._id, text);
		await this.getComments();
	}

	render(){
		let imageGal;
		if(this.props.data.photos){
			imageGal = <ImageGallary images={this.props.data.photos}/>
		}

		const comments = this.state.comments.map((data, index) => 
			<Comment data={data} key={index}/>
		)

		return(
			<div className='post white-c sans-font post-bc'>
				<FadeInOutHandleState condition={this.state.actionSuccess}>
					<SuccessCheck onCompleted={() => {this.props.reloadPosts(); this.setState({actionSuccess: false})}}/>
				</FadeInOutHandleState>
				<FadeInOutHandleState condition={this.state.actionFailure}>
					<FailedSent onCompleted={() => {this.props.reloadPosts(); this.setState({actionFailure: false})}}/>
				</FadeInOutHandleState>
				{this.state.showLoader ? <Loader/> : null}
				{this.props.data.author._id === this.props.currentUser._id ? <button onClick={() => this.setState({showDialog: true})} className='edit white-c'>...</button> : null}
				<Link to={'/profile/' + this.props.data.author._id} id={this.props.data.author._id}>
					<img 
						className='profile-photo' 
						alt='Not found' 
						src={"https://proficient-assets.s3.us-east-2.amazonaws.com/" + this.props.data.author.profilePictureURL}
						onError={(e) => {e.target.onerror=null; e.target.src='/generic_person.jpg'}}
					/>
					<h1 className='white-c'>{this.props.data.author.name}</h1>
				</Link>
				<FadeInOutHandleState condition={this.state.showDialog}>
					<MenuDropDown hideDropDown={() => this.setState({showDialog: false})}>
						<DropDownMain>
							<button onClick={() => this.remove()}> 
								<i style={{color: 'red'}} className="fas fa-trash"></i> Delete Post
							</button>
						</DropDownMain>
					</MenuDropDown>
				</FadeInOutHandleState>

				<h4 className='muted-c'>{convertToStdDate(this.props.data.date)}</h4>
				<p>{this.props.data.text}</p>
				{imageGal}
				
				<h4 className='muted-c'>
					<i className="fas fa-heart"></i> {this.state.likes.length} <span>  </span>
					<i className="fas fa-comment"></i> {this.state.comments.length}
				</h4>
			
				<InteractionSection 
					liked={this.state.likes.includes(this.props.currentUser._id)}
					toggleLike={() => this.toggleLike()}
					newComment={(text) => this.newComment(text)}
				/>

				<div className='comments-container'>
					{comments}
					{this.state.comments.length >0 ?
						<h4 className='muted-c'>{convertToStdDate(this.state.comments[this.state.comments.length-1].date)}</h4>
					: null}
				</div>
				
			</div>
		);
	}
}

function Comment(props){
	return(
		<div className='comment'>
			<p><Link to={'/profile/' + props.data.author._id} className='name green-c'>{props.data.author.name}</Link> {props.data.text}</p>
		</div>
	);
}

class InteractionSection extends React.Component{
	constructor(props){
		super(props);

		this.textArea = React.createRef();
	}

	newComment(key){
		const text = this.textArea.current.innerText.trim();

		if(key === 'Enter' && text !== ''){
			this.props.newComment(text);

			this.textArea.current.innerText = '';
		}else if(key==='Enter'){
			this.textArea.current.innerText = '';
		}
	}

	render(){
		return(
			<div className='comment-section'>
				<div className='row'>
					<div className='col-lg-1'>
						<button 
							onClick={() => this.props.toggleLike()} 
							className={this.props.liked ? 'blue-c' : 'white-c'}
						>
						<i className="fas fa-heart"></i></button>
					</div>
					<div className='col-lg-11'>
						<p 
							onKeyUp={(e) => this.newComment(e.key)} 
							className='p-fake'
						><span 
							ref={this.textArea}  
							className='textarea' 
							role='textbox' 
							contentEditable='true'
						></span>
						</p>
					</div>
				</div>
			</div>
		);
	}
}


export default Feed;