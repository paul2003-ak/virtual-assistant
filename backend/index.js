const express=require ('express')
const dotenv=require('dotenv')
dotenv.config();
const connecttoDb=require('./db/db')
const cookieparser=require('cookie-parser')
const cors=require('cors')

const user=require('./routes/user.routes');
const { geminiresponse } = require('./gemini');

connecttoDb();
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())

const PORT=process.env.PORT || 4000

//new type setup of cors
app.use(cors({
    origin:" https://virtual-assistant-frontend-ay0w.onrender.com",//react url
    credentials:true//Supports cookies and sessions (with credentials: true)
}))

app.use('/user',user);

 app.get("/",async(req,res)=>{
    let prompt=req.query.prompt
    let data=await geminiresponse(prompt)
    res.json(data)
 })

app.listen(PORT,()=>{
    console.log("running...")
})
