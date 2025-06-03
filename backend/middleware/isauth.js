const jwt=require('jsonwebtoken')
const usermodel=require('../models/user.model')


module.exports.authuser=async (req,res,next)=>{
     try{
        const token=req.cookies.token //pick the token from cookies
        if(!token){
            return res.status(401).json({ massage:'token  not found' });
        }

        const verifytoken= jwt.verify(token,process.env.JWT_SECRET);//gives us user_id after verify
        const user=await usermodel.findById(verifytoken._id);
        
        if(!user){
            return res.status(400).json({ massage:'user not found' });
        }

        req.user=user;
        
        return next()
        
     }catch(error){
        console.log(error)
        return res.status(500).json({ massage:'is auth error' });
     }
}