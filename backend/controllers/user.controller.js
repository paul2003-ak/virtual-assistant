  const uploadoncloudinary = require('../config/cloudinary');
const usermodel = require('../models/user.model')
const userservice = require('../services/user.services')


//signup
module.exports.register = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;

        const isuserexist = await usermodel.findOne({ email });
        if (isuserexist) {
            return res.status(501).json({ massage: 'user is already exist ' });
        }

        if (password.length < 6) {
            return res.status(400).json({ massage: 'password must be in 6 charecters' })
        }

        const hashpassword = await usermodel.hashpassword(password);

        const user = await userservice.createuser({
            fullname,
            email,
            password: hashpassword
        })

        const token = user.generatetoken();

        res.cookie('token', token, {
            httpOnly: true,     // 🔒 Prevents JS access via document.cookie
            secure: true,       // 🔐 Sends cookie over HTTP only when it deploy the it goes in HTTPS then it becomes true
            sameSite: "None" , // 🚫 Blocks cross-site cookie sending (CSRF protection)
            maxAge: 24 * 60 * 60 * 1000, // ⏳ 24 hrs 60 min 60 sec 1000 milisecond
        })

        res.status(201).json({ token, user })

    } catch (error) {
        res.status(500).json({ massage: `sign up error ${error}` })
    }

}

//signin 
module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(501).json({ massage: 'Email does not exists' });
        }

        const ismatch = await usermodel.hashpassword(password);

        if(!ismatch){
            return res.status(400).json({massage:"incorrect password"})
        }

        const token = user.generatetoken();
        
        res.cookie('token', token, {
            httpOnly: true,     // 🔒 Prevents JS access via document.cookie
            secure: true,       // 🔐 Sends cookie over HTTP only when it deploy the it goes in HTTPS then it becomes true
            sameSite: "None", // 🚫 Blocks cross-site cookie sending (CSRF protection)
            maxAge: 24 * 60 * 60 * 1000, // ⏳ 24 hrs 60 min 60 sec 1000 milisecond
        })

        res.status(200).json({ token, user })

    } catch (error) {
        res.status(500).json({ massage: `sign in error ${error}` })
    }

}

//logout
module.exports.logout = async(req,res,next)=>{
    try{
        res.clearCookie('token')
        return res.status(200).json({ message: 'Logout successful' });
    }catch(error){
        res.status(500).json({ massage: `logout error ${error}` })
    }
}

//getuserprofile 
module.exports.getuserprofile=async(req,res,next)=>{
    res.status(200).json(req.user)//req.user comes from isauth middleware .
}

module.exports.updateassistant=async(req,res,next)=>{
    try{
        const{assistantname,imageurl}=req.body//this image url for those 6 photo we store the path of those 6 image as it is in db
        let assistantimage;

        if(req.file){//*(multer)this is for if i select a new image in frontend after passing multer middleware it goes to cloudinary database
            assistantimage=await uploadoncloudinary(req.file.path)
        }else{//mean it is for those 6 images which already has in assets folder save 
            assistantimage=imageurl
        } 

        //after that we update the username 
        const user=await usermodel.findByIdAndUpdate(req.user,{assistantname,assistantimage},
        {new:true}).select("-password")//1st is isauth middleware and 2nd which one i want for update assistant name and assistant image 

        console.log(user)

        return res.status(200).json(user )
    }catch(error){
        res.status(500).json({ massage: "update assistant error" }) 
    }
}
