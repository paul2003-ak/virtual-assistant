const express = require("express")
const router=express.Router()
const usercontroller=require('../controllers/user.controller')
const geminicontroll=require('../controllers/gemini.controller')
const usermiddlewatre=require('../middleware/isauth')
const {body}=require('express-validator')
const upload = require("../middleware/multer")

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 charecters long'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 charecters long')
],usercontroller.register)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 charecters long')
],usercontroller.login)

router.get('/logout',usercontroller.logout)

router.get('/profile',usermiddlewatre.authuser,usercontroller.getuserprofile)

router.post('/updateassistant',usermiddlewatre.authuser,upload.single("assistantimage"),usercontroller.updateassistant)

router.post('/command',usermiddlewatre.authuser,geminicontroll.asktoassistant)

module.exports=router;
