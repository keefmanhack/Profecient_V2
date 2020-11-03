function generateUser(){
    const data ={ 
        name: makeString(10),
        username: makeString(10),
        password: makeString(10),
        school: {
            name: makeString(10),
            logoUrl: makeString(10),
        },
        email: makeString(5) + '@proficient.com',
        phoneNumber: makePhoneNumber(),
        profilePictureURL: makeString(10),
    }
    return data;
}

function makeString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function makePhoneNumber(){
    var result           = '';
    var characters       = '0123456789';
    for ( var i = 0; i < 11; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 11));
     }
     return parseInt(result);
}

module.exports = generateUser;