import React from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {convertToStdDate} from '../Home/Agenda/Agenda_Helper';

class Feed extends React.Component{
	constructor(props){
		super(props);

	}

	render(){
		const posts = this.props.feedData!==null ? this.props.feedData.map((data, index) =>
			<Post 
				data={data}
				currentUser={this.props.currentUser}
				key={index}
			/>
		) : <p>Currently No Posts</p>;
		return(
			<div className='feed white-c'>
				{posts}
			</div>
		);
	}
}

class Post extends React.Component{
	constructor(props){
		super(props);

		this.state={
			likes: [],
			comments: [],
		}
	}

	getLikes(){
		axios.get(`http://localhost:8080/posts/` + this.props.data._id + '/likes')
	    .then(res => {
			this.setState({
				likes: res.data,
			})
		})
	}

	getComments(){
		axios.get(`http://localhost:8080/posts/` + this.props.data._id + '/comments')
	    .then(res => {
			this.setState({
				comments: res.data,
			})
		})
	}

	toggleLike(){
		const endPoint = 'http://localhost:8080/posts/' + this.props.data._id +'/likes';
		let data = new FormData();
		data.append('userID', this.props.currentUser._id);

		axios.post(endPoint, {
			userID: this.props.currentUser._id,
		})
		.then((response) => {
		    this.getLikes();
		}).catch((error) => {
			console.log(error);
		});
	}

	newComment(text){
		const endPoint = 'http://localhost:8080/posts/' + this.props.data._id + '/comments';

		axios.post(endPoint, {
			text: text,
			author: this.props.currentUser._id,
		})
		.then((response) => {
		    this.getComments();
		}).catch((error) => {
		    console.log(error);
		});
	}

	componentDidMount(){
		this.getLikes();
		this.getComments();
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
					<img className='profile-photo' src={"https://proficient-assets.s3.us-east-2.amazonaws.com/" + this.props.data.author.profilePictureURL}/>
					<h1 className='white-c'>{this.props.data.author.name}</h1>
				</Link>
				

				{this.props.linkedClasses ? <h5>{this.props.linkedClasses}</h5> : null}
				

				<h4 className='muted-c'>{convertToStdDate(this.props.data.date)}</h4>
				<p>{this.props.data.text}</p>
				{imageGal}
				
				<h4 className='muted-c'>
					<i class="fas fa-heart"></i> {this.state.likes.length} <span>  </span>
					<i class="fas fa-comment"></i> {this.state.comments.length}
				</h4>
			
				<InteractionSection 
					currentUser={this.props.currentUser}
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
						<i class="fas fa-heart"></i></button>
					</div>
					<div className='col-lg-11'>
						<p 
							onKeyUp={(e) => this.newComment(e.key)} 
							className='p-fake'
						><span 
							ref={this.textArea}  
							className='textarea' 
							role='textbox' 
							contenteditable='true'
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
		<div className='col-lg-6'>
			<img className='image' key={index} src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + imagePath}/>
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