const UserService = require("../User/index")

const isValid = async (req, res, next) => {
    const foundUser = await UserService.findById(req.params.id);
    if(foundUser.access_token !== req.headers['authorization']){
        res.json({success: false})
        // throw new Error('Credentials not valid');
        console.log('Credentials not valid');
    }else{
        next();
    }
}

module.exports = isValid;