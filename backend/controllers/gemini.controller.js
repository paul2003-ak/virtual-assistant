const { geminiresponse } = require("../gemini");
const usermodel = require("../models/user.model");
const moment=require('moment')

module.exports.asktoassistant=async(req,res)=>{
    try{
        const {command}=req.body
        const user=await usermodel.findById(req.user);
        const username=user.fullname
        const assistantname=user.assistantname

        const result=await geminiresponse(command,assistantname,username)

        const jsonMatch=result.match(/{[\s\S]*}/)
        if(!jsonMatch){
            // Log the raw result that failed to parse for debugging
            console.error("Gemini response did not contain a valid JSON object:", result);
            return res.status(400).json({response:"Sorry, I couldn't understand the command from the AI."}) // More specific error message
        }
        const geminiresult=JSON.parse(jsonMatch[0])

        const type=geminiresult.type


        switch(type){
            case 'get-date' : 
                return res.json({
                    type,
                    userinput:geminiresult.userinput,
                    response:`current date is ${moment().format('YYYY-MM-DD')}`
                });
            case 'get-time' : 
            return res.json({
                type,
                userinput:geminiresult.userinput,
                response:`current time is ${moment().format('hh:mm A')}`
            });
            case 'get-day' : 
            return res.json({
                type,
                userinput:geminiresult.userinput,
                response:`today is ${moment().format('dddd')}`
            });
            case 'get-month' : 
            return res.json({
                type,
                userinput:geminiresult.userinput,
                response:`today is ${moment().format('MMMM')}`
            });
            case 'google-search':
            case 'Youtube': // Added Youtube here for consistency
            case 'youtube-play':
            case 'general':
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
                
            return res.json({
                type,
                userinput:geminiresult.userinput,
                response:geminiresult.response,
            })

            default:
                console.warn(`Unknown command type received from Gemini: ${type}`); // Log unknown types
                return res.status(400).json({response: "I didn't understand that command."})
        }


    }catch(error){
        console.error("Error in asktoassistant:", error); // More detailed error logging
        return res.status(500).json({response: "An internal server error occurred while processing your request."}) // Generic user-friendly error
    }
}