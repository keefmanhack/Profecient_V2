import React from 'react';

class MessageCenter extends React.Component{
	render(){
		return(
			<div className='page-container message-center'>
				<div className='row'>
					<div className='col-lg-4 left' style={{borderRight: '1px solid'}}>
						<div className='row'>
							<div className='col-lg-10'>
								<input placeholder='Find classmates' type="text"/>
							</div>
							<div className='col-lg-2'>
								<button>+</button>
							</div>
						</div>
						<div className='message-trail'>
							<div className='row'>
								<div className='col-lg-1'>
									<img src="generic_person.jpg" alt="Can't display photo"/>
								</div>
								<div className='col-lg-7'>
									<h1>Sarah Steel</h1>
								</div>
								<div className='col-lg-4'>
									<h2>1 New Message</h2>
								</div>
							</div>
							<h3>5 Days Ago</h3>
							<p>Nonsense adsfjaslkdfja lskdjfklasjd flkajsdflk asdfasdf asdfasdf asdf</p>
						</div>
					</div>
					<div className='col-lg-8'>
						<div className='right'>
							<div className='header'>
								<img src="generic_person.jpg" alt="Can't display photo"/>
								<h1>Sarah Steel</h1>
							</div>
							<div className='messages-container'>
								<div className='messages'>
									<h5>11:05 AM Jan 5th 2020</h5>

									<div className='received'>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!</p>
									</div>

									<div className='sent'>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat repudiandae unde, error illo hic, delectus? Expedita doloremque, reiciendis odit laboriosam voluptatem nam veritatis obcaecati ullam, eum pariatur aut, repellat hic!</p>
									</div>
								</div>
								<div className='reply'>
									<textarea></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		)
	}
}

export default MessageCenter;