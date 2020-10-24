const create = PostBucket => async () => {
	const newBucket = new PostBucket();
	return await newBucket.save();
}

const deleteById = PostBucket => async id => {
	if(!id){
		throw new Error("Missing ID to delete post bucket");
	}
	await PostBucket.findByIdAndRemove(id);
}

const size = PostBucket => async () => {
	const val = await PostBucket.count({});
	return val;
}

module.exports = PostBucket => {
	return{
		create: create(PostBucket),
		size: size(PostBucket),
		deleteById: deleteById(PostBucket),
	}
}