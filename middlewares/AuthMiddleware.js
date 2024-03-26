const { verify } = require("jsonwebtoken");

const validateToken = async(req, res, next) =>{
    const accessToken = await req.header("accessToken");
    console.log(accessToken);

    if(!accessToken) return res.status(404).json({error:"User not logged in!"});

    try{
        const validToken = verify(accessToken, "importantsecret");
        req.user = validToken;
        if(validToken){
            return next();
        }
    } 
    catch (err){
        return res.json({error: err});
    }
};

module.exports = { validateToken };