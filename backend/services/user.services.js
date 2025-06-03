const usermodel=require('../models/user.model')

module.exports.createuser=async({
    fullname,
    email,
    password
})=>{
    if(!fullname || !email || !password){
        throw new Error('All fieldis required');
    }
    const user=usermodel.create({
        fullname,
        email,
        password
    })

    return user;
}