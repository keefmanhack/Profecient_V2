const BaseRequests = require('../../../BaseServiceRequests');
module.exports = PostBucket => {
	return{
		create: BaseRequests.create(PostBucket),
		size: BaseRequests.size(PostBucket),
		deleteById: BaseRequests.deleteById(PostBucket),
	}
}