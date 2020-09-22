import React from 'react';
import {FadeInOut_HandleState} from './CustomTransition';
import axios from 'axios';
import FormData from 'form-data';
import Loader from './loader';

class PostCreator extends React.Component{
	constructor(props){
		super(props);
		this.state={
			images: null,
			error: false,
			max_Image_Err: false,
			sendingData: false,
			httpError: false,
		}

		this.fileInput = React.createRef();
		this.textArea = React.createRef();

		this.MAX_IMAGES = 6; 
	}

	addImages(files){
		if(files.length <= this.MAX_IMAGES){
			let tempArr = [];
			for(let i =0; i<files.length; i++){
				let reader = new FileReader();
				reader.onload = function(e){
					tempArr.push(e.target.result);
					this.setState({
						images: tempArr,
					});
				}.bind(this);
				reader.readAsDataURL(files[i]);
			}
			this.setState({
				max_Image_Err: false,
			})
		}else{
			this.setState({
				max_Image_Err: true,
			})
		}

	}

	removeImage(i){
		let images_copy = this.state.images;
		images_copy.splice(i,i+1);
		this.setState({
			images: images_copy,
		})
	}

	checkError(){
		if(this.textArea.current.innerText === '' && this.state.images === null){
			this.setState({
				error: true,
			});
			return true;
		}else{
			this.setState({
				error: false,
			});
			return false;
		}
	}

	sendData(){
		const checkError = this.checkError();

		if(!checkError){
			this.setState({
				sendingData: true,
			});

			const endPoint = 'http://localhost:8080/users/' + this.props.currentUser._id + '/' + 'posts';
			let data = new FormData();

			data.append('text', this.textArea.current.innerText);
			if(this.state.images)
				this.state.images.forEach(function(image){
					data.append('images', image);
				})
			

			axios.post(endPoint, data, {
			  headers: {
			    'accept': 'application/json',
			    'Accept-Language': 'en-US,en;q=0.8',
			    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
			  }
			})
			.then((response) => {
			    this.setState({
			    	sendingData: false,
			    	images: null,
			    	httpError: false,
			    })
			    this.textArea.current.innerText = '';
			    this.props.reloadFeed();
			}).catch((error) => {
			    this.setState({
			    	sendingData: false,
			    	httpError: true,
			    })
			});
		}
	}

	render(){
		const images = this.state.images ? this.state.images.map((data, index)=>
				<ImagePreviewer key={index} remove={() => this.removeImage(index)} data={data}/>
			): ' ';
		return(
			<div className="make-post mont-font">
	    		<h5><span style={{fontWeight: 600}}>{this.props.currentUser.name.split(' ')[0]}</span>, what happened today in class?</h5>
		        <p>
		        	<span 
		        		className='textarea' 
		        		role='textbox' 
		        		contenteditable='true'
		        		style={this.state.error ? {border: '1px solid red', transition: '.3s'} : null}
		        		ref={this.textArea}
		        	></span>
		        </p>
		        <FadeInOut_HandleState condition={this.state.images !== null}>
			        <div className='row image-gal'>
						{images}
			        </div>
			    </FadeInOut_HandleState>
				<button 
					onClick={() => this.fileInput.current.click()} 
					style={{background: 'none'}} 
					className='white-c'>
					<i class="fas fa-camera-retro"></i>
				</button>
				<button className='submit blue-bc' onClick={() => this.sendData()}>Submit</button>


				<FadeInOut_HandleState condition={this.state.max_Image_Err}>
					<h5 className='error-msg' style={{color: 'red'}}>Maximum of six images</h5>
				</FadeInOut_HandleState>
				<FadeInOut_HandleState condition={this.state.httpError}>
					<h5 className='error-msg' style={{color: 'red'}}>Error while making post</h5>
				</FadeInOut_HandleState>
				
				<input 
					type="file" 
					ref={this.fileInput} 
					style={{display: 'none'}}
					accept="image/png, image/jpeg"
					multiple={true}
					onChange={() => this.addImages(this.fileInput.current.files)}
				/>
				{this.state.sendingData ? <Loader/> : null}
	      	</div>
		);
	}
}

class ImagePreviewer extends React.Component{
	constructor(props){
		super(props);
		this.state={
			mouseOver: false,
		}
	}
	render(){
		return(
			<div className='col-lg-4'>
				<div onMouseEnter={() => this.setState({mouseOver: true})} onMouseLeave={() => this.setState({mouseOver: false})} className='image-con'>
					<img src={this.props.data} alt=""/>
					<FadeInOut_HandleState condition={this.state.mouseOver}>
							<div className='overlay'>
								<button onClick={() => this.props.remove()}><i class="fas fa-times-circle"></i></button>
							</div>
					</FadeInOut_HandleState>
				</div>
			</div>
		)
	}
}

export default PostCreator;