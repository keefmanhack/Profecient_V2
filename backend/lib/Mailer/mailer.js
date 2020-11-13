const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//gmail config
const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENTID, // ClientID
    process.env.GMAIL_CLIENTSECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESHTOKEN,
});

//end of gmail config
async function createTransporter(){
    const smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
            port: 465,
        secure: true,
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_EMAIL,
            clientId: process.env.GMAIL_CLIENTID,
            clientSecret: process.env.GMAIL_CLIENTSECRET,
            refreshToken: process.env.GMAIL_REFRESHTOKEN,
            accessToken: await oauth2Client.getAccessToken(),
        }
    })
    return smtpTransport;
}


const sendPasswordCode = async (email, token) => {
    const smtpTransport = await createTransporter();
    var mailOptions = {
        to: email,
        from: process.env.GMAIL_EMAIL,
        subject: 'Proficient password reset',
        text: 'You are receiving this email because you have requested to reset your password ' +
        'for your student account with Proficient.\n'+
        '----------------------- \n\n\n' +
        'Your token: ' + token +
        '\n\n\n---------------'+
        'If you did not request this plese disregard this email.'
    };

    const res = await smtpTransport.sendMail(mailOptions);
    if(res.accepted.length>=1){
        return {success: true}
    }
    return {success: false}
}

const sendPasswordUpdatedVerification = async email =>{
    const smtpTransport = await createTransporter();
    var mailOptions = {
        to: email,
        from: process.env.GMAIL_EMAIL,
        subject: 'Success: Proficient password reset',
        text: 'Your Proficient account password was successfully updated\n\n' +
        'If you did not request this plese disregard this email.'
    };

    const res = await smtpTransport.sendMail(mailOptions);
    if(res.accepted.length>=1){
        return {success: true}
    }
    return {success: false}
}

module.exports = {sendPasswordCode, sendPasswordUpdatedVerification};