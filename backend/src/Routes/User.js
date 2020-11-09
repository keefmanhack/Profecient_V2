const express = require("express"),
      router  = express.Router(),
      passport = require('passport');

const UserService = require('../../lib/User/index');

const FriendHandler = require('../../lib/CompositeServices/Notification/Relations/FriendHandler');

router.get('/users/verify', async (req, res) => {
    const query = req.query;
    const validation = await UserService.validate(query);
    res.json(validation);
})

router.get('/success', (req, res) => {
    console.log('success');
})

router.get('/failure', (req, res) => {
    res.json({success: false})
})

router.get('/user/tokens', async (req, res) => {
    const user = await UserService.findByRefreshToken(req.query.refresh_token);
    const tokens = generateTokens();
    await UserService.setTokens(user._id, tokens);

    res.json(tokens);
})

router.get('/user/current', async (req, res) => {
    const user = await UserService.findByAccessToken(req.query.access_token);
    res.json(user);
})

router.post('/login', passport.authenticate("local", { failureRedirect: '/failure'} ), async (req, res) =>{
    const tokens = generateTokens();
    await UserService.setTokens(req.user._id, tokens);

    res.json({success: true, tokens: tokens});
})

function generateTokens(){
    const tokenLength = 16;
    return {access_token: generate_token(tokenLength), refresh_token: generate_token(tokenLength)};
}

function generate_token(length){
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

router.get('/users/:id', async (req, res) => {
    try{
        const user = await UserService.findById(req.params.id);
        res.json(user);
    }catch(err){	
        console.log(err);
    }
});

router.post('/user/new', async (req, res) => {
    try{
        const response = await UserService.create(req.body);
        res.json(response);
    }catch(err){
        console.log(err);
    }
})

router.post('/users', async (req, res) => {
    try{
        const users = await UserService.findUsersByName(req.body.searchString);
        res.json(users);
    }catch(err){
        console.log(err);
    }
})

router.post('/users/:id/following', async (req, res) =>{
    try{
        const user = await UserService.findById(req.params.id);
        const isFollowing = user.following.includes(req.body.userID)
        await UserService.toggleUserFollowing(user._id, req.body.userID, isFollowing);
        await UserService.toggleUserFollowers(req.body.userID, user._id);
        res.send();
        if(!isFollowing){
            FriendHandler.createAndAddANewFollowerNotif(req.params.id, req.body.userID);
        }
    }catch(err){
        console.log(err);
    }
})  

module.exports = router;