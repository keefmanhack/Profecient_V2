const UserService = require('../../../../User/index');
const PostService = require('../../../../Post/index');
const CommentService = require('../../../../Comment/index');

const formatFunc = async postBucketData => {
    if(!postBucketData.lastLiker  && !postBucketData.lastComment){
        return [];
    }
    const post = await PostService.findById(postBucketData.postID);
    let likeData, commentData;

    if(postBucketData.lastLiker){
        const lastLiker = await UserService.findById(postBucketData.lastLiker);
        likeData = {
            lastLiker: {
                name: lastLiker.name,
                profilePictureURL: lastLiker.profilePictureURL,
                id: lastLiker._id,
            },
            otherLikerCt: post.likes.length-1,
        }
    }

    if(postBucketData.lastComment){
        const comment = await CommentService.findById(postBucketData.lastComment);
        const lastCommenter = await UserService.findById(comment.author);
        commentData = {
            lastCommenter: {
                name: lastCommenter.name,
                profilePictureURL: lastCommenter.profilePictureURL,
                id: lastCommenter._id,
            },
            text: comment.text,
            otherCommentsCt: post.comments.length-1,
        }
    }
    
    const data ={
        likeData: likeData,
        commentData: commentData,
        postData: {
            id: post._id,
            text: post.text,
            photos: post.photos,
        },
        timeStamp: postBucketData.timeStamp,
        type: 'PostBucket',
    }
    return [data];
}

module.exports = formatFunc;