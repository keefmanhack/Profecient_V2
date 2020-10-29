import React from 'react';

function ImageGallary(props){
	const smallImages = props.images.map((imagePath, index) =>
		<div key={index} className='col-lg-6'>
			<img 
				className='image' 
				alt='Not found' 
				key={index} 
				src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + imagePath}
				onError={(e) => {e.target.onerror=null; e.target.src='/generic_school.jpg'}}
			/>
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

export default ImageGallary;