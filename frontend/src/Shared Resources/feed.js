import React from 'react';
import {Link} from "react-router-dom";

import {convertToStdDate} from '../Home/Agenda/Agenda_Helper';

import PostRequests from '../APIRequests/Post';

function Feed(props){
	const postReq  = new PostRequests(props.currentUser._id);

	const posts = props.feedData!==null ? props.feedData.map((data, index) =>
		<Post 
			data={data}
			currentUser={props.currentUser}
			postReq={postReq}
			key={index}
		/>
	) : <p>Currently No Posts</p>;

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
		}
	}

	componentDidMount(){
		this.getLikes();
		this.getComments();
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
			<div className='post white-c sans-font'>
				<Link to={'/profile/' + this.props.data.author._id} id={this.props.data.author._id}>
					<img className='profile-photo' alt='Not found' src={"https://proficient-assets.s3.us-east-2.amazonaws.com/" + this.props.data.author.profilePictureURL}/>
					<h1 className='white-c'>{this.props.data.author.name}</h1>
				</Link>
				

				{this.props.linkedClasses ? <h5>{this.props.linkedClasses}</h5> : null}
				

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
			<p><Link to='#' className='name green-c'>{props.data.author.name}</Link> {props.data.text}</p>
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

function ImageGallary(props){
	const smallImages = props.images.map((imagePath, index) =>
		<div key={index} className='col-lg-6'>
			<img className='image' alt='Not found' key={index} src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + imagePath}/>
		</div>
	);

	return(
		<div className='image-gal'>
			<div className='row'>
				{smallImages}
			</div>
		</div>
	);
}


export default Feed;