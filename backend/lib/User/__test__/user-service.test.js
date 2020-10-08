const sinon = require('sinon');

const UserService = require('../user-service');


describe('Create User test', () =>{
	it('Can create a user', () =>{
		const save = sinon.spy();
		let user;

		const MockModel = data => {
			user = data.user;
			return {
				...data,
				save
			}
		}

		const userService = UserService(MockModel);
		userService.createUser(user);

		expect(user).toEqual(user);
	})
})