import React from 'react';

function Header(){
	return(
		<div className='top-bar' style={style_topBar}>
			<div className='row'>
				<div className='col-lg-2'>
					<h1>Profecient</h1>
				</div>

				<div className='col-lg-3'>
					<input className='form-control' type='text' placeholder='Find classmates' style={{position: 'relative', top: 5}} />
				</div>
			</div>
		</div>
	);
}

const style_topBar = {
	backgroundColor: '#171D1C', 
	color: 'white',
	paddingTop: 10,
	paddingLeft: 40,
	paddingRight: 40
}

export default Header;

