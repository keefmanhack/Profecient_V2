const UserService = require("../User/index")

const errorMsg = {success: false, error: 'Credentials are not valid, try signing back in'};
const isValid = async (req, res, next) => {
    try{
        const foundUser = await UserService.findById(req.params.id);
        if(foundUser.access_token !== req.headers['authorization']){
            res.json(errorMsg)
            // throw new Error('Credentials not valid');
            console.log('Credentials not valid');
        }else{
            next();
        }
    }catch(err){
        console.log(err);
        res.json(errorMsg)
    }
}

module.exports = isValid;