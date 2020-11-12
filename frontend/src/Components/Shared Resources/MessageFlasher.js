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
            this.timer = null;
        }.bind(this), this.state.timeout);
    }


    render(){
        const Animation = this.props.animation;
        if(!Animation){
            return null;
        }else{
            if(this.timer==null && this.props.condition){
                this.setEndFlashTimer();
            }
            return(
                <div style={flashStyles}>
                    <Animation condition={this.props.condition}>
                        {this.props.children}
                    </Animation>
                </div>
            )
        }
    }
}

const flashStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
}

export default MessageFlasher;