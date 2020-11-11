import React from 'react';

class MessageFlasher extends React.Component{
    constructor(props){
        super(props);
        this.state={
            timeout: this.props.timeOut? props.timeOut : 1500,
        }

        this.timer = null;
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    setEndFlashTimer(){
        this.timer = setTimeout(function(){
            this.props.resetter();
        }, this.state.timeout)
    }


    render(){
        if(this.props.condition){
            this.setEndFlashTimer();
            return(
                <div style={flashStyles} className='flash-message'>
                    {this.props.children}
                </div>
            )
        }else{
            return null;
        }
    }
}

const flashStyles = {
    position: 'fixed',
    margin: '10px 33%',
}

export default MessageFlasher;