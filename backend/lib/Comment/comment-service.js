const BaseRequests = require('../BaseServiceRequests');

const findMultiple = Comment => async ids =>{
	if(!ids){
		throw new Error('No ids for comments');
	}
	return await Comment.find({_id: ids}).populate('author');
}

module.exports = Comment => {
	return {
		findMultiple: findMultiple(Comment),
		create: BaseRequests.create(Comment),
	}
}