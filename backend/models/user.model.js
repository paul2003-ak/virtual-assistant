const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const userschema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requires:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantname:{
        type:String,
        
    },
    assistantimage:{
        type:String,
        
    },
    history:[
        {type:String}
    ]
},{timestamps:true})


userschema.statics.hashpassword=async function(password){
    return await bcrypt.hash(password,10);
}

userschema.methods.generatetoken=function(){
    const token = jwt.sign({ _id: this._id },process.env.JWT_SECRET,{ expiresIn: '24h' });//token expire in 24 hrs
    return token;
}

userschema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const usermodel=mongoose.model("user",userschema)
module.exports=usermodel