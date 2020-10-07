require('dotenv').config();
const mongoose = require('mongoose');

const NotificationHandler =  require('./NotificationHandler');

const User = require('../../models/user');


describe('Academic Notification Tests', () => {
	beforeAll(async () => {
        await mongoose.connect(process.env.PROF_MONGO_DB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }else{
            	console.log('Mongoose connected');
            }
        });
    });

     it('create & save user successfully', async () => {
        
     	
        
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.gender).toBe(userData.gender);
        expect(savedUser.dob).toBe(userData.dob);
        expect(savedUser.loginUsing).toBe(userData.loginUsing);
    });
})
