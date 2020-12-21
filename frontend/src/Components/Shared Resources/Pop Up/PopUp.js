import React from 'react';

import './index.css';
class PopUp extends React.Component{
    constructor(props){
        super(props)

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
            this.props.hideForm();
        }
    }

    render(){
        return(
            <React.Fragment>
                <div className='background-shader'/>
                <div ref={this.wrapperRef} className={'pop-up ' + this.props.className}>
                    {this.props.children}
                </div>
            </React.Fragment>

        )
    }
}

export default PopUp;