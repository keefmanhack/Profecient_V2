/*
Test Cases
----------
-(check) Create User
-(check) Update User
-Delete User
-Find User
*/

const mongoose =  require('mongoose');

const User  = require('../user-model.js');

require('dotenv').config();

let mongoUrl = process.env.PROF_MONGO_DB_TEST;

let pretendUser = {
	name: 'Jannis Joplin',
	school: {
		name: 'Awesome University',
		logoUrl: 'this is another url',
	},
	email: 'myrandomemail@yahoo.com',
	profilePictureURL: 'thisisaurlstringwhichtakesyoutosomewhere.com',
}

beforeAll(async () => {
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({})
})

afterEach(async () => {
  User.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})


describe('User model tests', () => {
	it('can create a new User', async () => {
		await new User(pretendUser).save();
		const userCount = await User.countDocuments();
		expect(userCount).toEqual(1);
	}),
	it('can update a User', async () => {
		const user  = await new User(pretendUser).save();
		let tempUser = pretendUser;

		const fetchedUser = await User.findByIdAndUpdate(user._id, {name: 'Temp User'}, {new: true});
		expect(fetchedUser.name).toEqual('Temp User');
	})
})