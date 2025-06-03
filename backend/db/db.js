const mongoose=require('mongoose')

function connecttoDb(){
    mongoose.connect(process.env.MONGODB_URL
    ).then(()=>{
        console.log("connect to Db..")
    }).catch(error=>{
        console.log(error)
    })
}

module.exports=connecttoDb