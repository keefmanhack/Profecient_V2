import React from 'react';
import {Link} from "react-router-dom";

import Notification from '../../Abstract Notification/AbstractNotification';
import ImageGallery from '../../../ImageGallary';

import './index.css';

function PostBucketNotification(props){
    return(
        <Notification
            notifType={'PostBucket'}
            notifName={'Post Update'}
            removeNotif={() => props.removeNotif()}
            interaction={null}
            mainData={
                    <div className='post-info white-bc'>   
                        <p>{props.data.postData.text}</p>
                        {props.data.postData.photos.length>0 ?
                            <div className='image-gal-cont'>
                                <hr/>
                                <ImageGallery images={props.data.postData.photos}/>
                            </div>
                        : null}
                    </div>
            }
            auxData={
                <div className='interactions'> 
                    {props.data.likeData ? 
                        <div className='data'>
                            <Link to={'/profile/' + props.data.likeData.lastLiker.id}>
                                <div className='person'>
                                    <img 
                                        src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.data.likeData.lastLiker.profilePictureURL} 
                                        alt=""
                                        onError={(e) => e.target.src="/generic_person.jpg"}
                                    />
                                    <h3>{props.data.likeData.lastLiker.name} <span className='blue-c'>liked</span> </h3>
                                </div>
                            </Link>
                            <h4 className='muted-c'> with <span className='blue-c'>{props.data.likeData.otherLikerCt}</span> other</h4>
                        </div>
                    :
                        null    
                    }
                    {props.data.commentData ? 
                        <div className='data comment'>
                            <Link to={'/profile/' + props.data.commentData.lastCommenter.id}>
                                <div className='person'>
                                    <img 
                                        src={'https://proficient-assets.s3.us-east-2.amazonaws.com/' + props.data.commentData.lastCommenter.profilePictureURL} 
                                        alt=""
                                        onError={(e) => e.target.src="/generic_person.jpg"}
                                    />
                                    <h3>{props.data.commentData.lastCommenter.name} <span className='blue-c'>commented</span></h3>
                                </div>
                            </Link>
                            <h4 className='muted-c'> with <span className='blue-c'>{props.data.commentData.otherCommentsCt}</span> other</h4>
                            <p>{props.data.commentData.text}</p>
                        </div>
                    :
                        null    
                    }
                </div>
            }
            timeStamp={props.data.timeStamp}
        />
    )
}

export default PostBucketNotification;