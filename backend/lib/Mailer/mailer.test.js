require('dotenv').config();
const myMailer = require('./mailer');


describe('Can send an email', () => {
    it('Can send an email', async done =>{
        // await myMailer.sendPasswordCode('gregoire001@gannon.edu', '20394');

        done();
    })
})