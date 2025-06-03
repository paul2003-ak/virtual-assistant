const axios = require('axios')

module.exports.geminiresponse = async (command, assistantname, username) => {
    try {
        const apiurl = process.env.GEMINI_API_URL

        const prompt = `you are a virtual assistant named ${assistantname} created by ${username}. 
you are not google.you will now behave like a voice-enebled assistant.

your task is to understand he user's nature language input and response with a JSON object like this:
{
"type": "general" | "google-search" | "Youtube" | "youtube-play" |"get-time" | "get-date" | "get-day" | "get_month" | "calculator-open" |
"instagram-open" | "facebook-open" | "weather-show",

"userinput": "<original user input> {only remove your name from userinput if exists} 
and agar kisi ne google ya youtube pe kuch search karne ko bola hai to 
userInput me only bo search baala text jaye,

"response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question.
- "google-search": if user wants to search something on Google.
- "Youtube": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video or song.
- "calculator-open": if user wants to open a calculator.
- "instagram-open": if user wants to open Instagram.
- "facebook-open": if user wants to open Facebook.
- "weather-show": if user wants to know weather
- "get-time": if user asks for current time.
- "get-date": if user asks for today's date.
- "get-day": if user asks what day it is.
- "get-month": if user asks for the current month.

Important:
- Use ${username} agar koi puche tume kisne banaya
- Only respond with the JSON object, nothing else.

now your userInput- ${command}
`;


        const result = await axios.post(apiurl, {
            "contents": [{
                "parts": [{ "text": prompt }]
            }]
        })

        // Ensure the response is trimmed and only the JSON part is returned
        const responseText = result.data.candidates[0].content.parts[0].text.trim();
        // It's crucial that the Gemini model consistently returns valid JSON and ONLY JSON.
        // If it ever includes extra text, it will break the JSON.parse on the server side.
        // The prompt asks for "Only respond with the JSON object, nothing else."
        // but adding a safety regex match here is good practice if Gemini sometimes adds preamble/postamble.
        const jsonMatch = responseText.match(/{[\s\S]*}/);
        if (jsonMatch) {
            return jsonMatch[0]; // Return only the matched JSON string
        } else {
            console.error("Gemini API response did not contain a valid JSON object:", responseText);
            return null; // Return null if no JSON is found, to be handled gracefully by controller
        }

    } catch (error) {
        console.error("Error in geminiresponse (axios call or parsing):", error);
        // It's better to throw the error or return null here, so the controller can handle it.
        throw error; // Re-throw to be caught by asktoassistant in gemini.controller.js
    }
}