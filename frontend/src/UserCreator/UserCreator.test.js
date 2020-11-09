import UserCreator from './UserCreator';

describe('Can create and login a new user', () => {
    let UC = new UserCreator();
    it('Can create a new user', async () => {
        await UC.handleEvent({name: 'j f', email: 'e@y.com', phoneNumber:111111111, password: 'j23kfif4'});
        await UC.handleEvent({username: 'josh'});
        
    })
})