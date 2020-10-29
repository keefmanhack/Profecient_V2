class NotificationRequest{
	constructor(id, reqClass){
		this.concreteReq = new reqClass(id);
	}

	get = async () => {
		return await this.concreteReq.get();
	}

	delete = async id => {
		return await this.concreteReq.delete(id);
	}
}
export default NotificationRequest;