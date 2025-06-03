const cloudinary = require('cloudinary').v2;
const fs =require('fs')

const uploadoncloudinary=async (filepath)=>{
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET //**Click 'View API Keys' above to copy your API secret
    });

    try{
        const uploadResult = await cloudinary.uploader.upload(filepath)

        fs.unlinkSync(filepath )//delete the images which one stores in public folder

       return uploadResult.secure_url

    }catch(error){
        fs.unlinkSync(filepath )
        console.log("Cloudinary upload error:",error)
    }
}

module.exports=uploadoncloudinary