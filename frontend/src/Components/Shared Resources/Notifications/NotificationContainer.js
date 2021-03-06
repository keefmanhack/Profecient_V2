import React, { useState } from 'react';
import moment from 'moment';

import Loader from '../Effects/Loader/loader';
import FormatSelector from './Formatter/Formatter';

import './notif-container.css';
import NotificationRequest from '../../../APIRequests/Notification/Notification';

class NotificationContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notifs: null,
        }

        this.notifReq = new NotificationRequest(this.props.currentUserID, this.props.type);

        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.requestNotifications = this.requestNotifications.bind(this);
        this.removeNotif = this.removeNotif.bind(this);
    }

    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
        this.requestNotifications();
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hide();
        }
    }

    async requestNotifications(){
        this.setState({notifs: await this.notifReq.get()});
    }

    async removeNotif(id){
        await this.notifReq.delete(id);
        await this.requestNotifications();
    }

    render(){
        const notifs = FormatSelector.format(this.state.notifs, this.removeNotif);

        return(
            <div className='notif-container' ref={this.wrapperRef}>
                {this.state.notifs ? 
					<React.Fragment>
						{this.state.notifs.length>0 ? 
							<React.Fragment>
								{notifs}
							</React.Fragment>
						:
							<p style={{textAlign: 'center'}} className='muted-c'>No notifications</p>
						}
					</React.Fragment>
				:
					<Loader/>
				}
            </div>
        )
    }
}

export default NotificationContainer;