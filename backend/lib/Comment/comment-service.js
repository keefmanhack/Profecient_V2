const findMultiple = Comment => async ids =>{
	if(!ids){
		throw new Error('No ids for comments');
	}
	return await Comment.find({_id: ids}).populate('author');
}

const create = Comment => async data => {
	if(!data){
		throw new Error('No data to create a new comment');
	}
	return await Comment.create(data);
}

module.exports = Comment => {
	return {
		findMultiple: findMultiple(Comment),
		create: create(Comment),
	}
}