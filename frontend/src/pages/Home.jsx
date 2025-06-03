import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';

import { userdatacontext } from '../context/Usercontext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { userdata, setUserdata, geminiresponse } = useContext(userdatacontext);
  const [listening, setListening] = useState(false);

  const isspeakingref = useRef(false);
  const recognitionref = useRef(null);
  const isrecognizingref = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const lastErrorWasAborted = useRef(false);

  const synth = useRef(window.speechSynthesis);

  const handlelogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/logout", { withCredentials: true });
      navigate("/signin");
      console.log('Logout response:', response);
      setUserdata(null);
    } catch (error) {
      setUserdata(null);
      console.error("Logout error:", error);
      navigate("/signin");
    }
  };

  const saferecognition = useCallback(() => {
    if (!recognitionref.current) {
      console.log("Recognition instance not available.");
      return;
    }
    if (!userdata || !userdata.assistantname) {
      console.warn("Userdata or assistant name not available. Recognition will not start.");
      return;
    }

    if (!isspeakingref.current && !isrecognizingref.current) {
      try {
        console.log("Attempting recognition.start()");
        recognitionref.current.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Error starting recognition:", error);
        } else {
          console.log("Recognition already started or in invalid state (InvalidStateError).");
        }
      }
    }
  }, [userdata]);

  const speak = useCallback((text) => {
    if (!text) {
        console.warn("Speak function called with no text.");
        saferecognition();
        return;
    }
    const utterence = new SpeechSynthesisUtterance(text);
    isspeakingref.current = true;

    if (recognitionref.current && isrecognizingref.current) {
      console.log("Stopping recognition before speaking.");
      recognitionref.current.stop();
    }

    utterence.onstart = () => {
      console.log("Speech started for:", text);
    };

    utterence.onend = () => {
      console.log("Speech ended.");
      isspeakingref.current = false;
      console.log("Attempting to restart recognition after speech.");
      saferecognition();
    };

    utterence.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      isspeakingref.current = false;
      console.log("Attempting to restart recognition after speech error.");
      saferecognition();
    };

    if (synth.current) {
      synth.current.speak(utterence);
    } else {
      console.error("Speech synthesis not available.");
      isspeakingref.current = false;
      saferecognition();
    }
  }, [saferecognition]);

  const handlecommand = useCallback((data) => {
    if (!data || !data.type || !data.response) {
        console.warn("Invalid data received for handlecommand:", data);
        speak("I encountered an issue processing that command.");
        return;
    }
    const { type, userinput, response } = data; // Changed 'userInput' to 'userinput' to match server-side casing
    speak(response); // Speak the response first

    let query;
    switch (type) {
      case 'google-search':
        query = encodeURIComponent(userinput);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
        break;
      case 'calculator-open':
        window.open(`https://www.google.com/search?q=calculator`, '_blank');
        break;
      case 'instagram-open':
        window.open(`https://www.instagram.com/`, '_blank');
        break;
      case 'facebook-open':
        window.open(`https://www.facebook.com/`, '_blank');
        break;
      case 'weather-show':
        window.open(`https://www.google.com/search?q=weather`, '_blank');
        break;
      case 'Youtube': // Added Youtube type for clarity
      case 'youtube-play':
        query = encodeURIComponent(userinput); // Use userinput as the search query
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank'); // CORRECTED YOUTUBE URL
        break;
      default:
        console.log(`Unknown command type: ${type}`);
        // Consider a spoken response for unhandled types
        // speak(`I understand you said something about ${type}, but I'm not configured to perform that action yet.`);
    }
  }, [speak]);

  useEffect(() => {
    if (!userdata || !userdata.assistantname || !geminiresponse) {
      console.warn("Userdata, assistant name, or geminiresponse not available yet. Speech recognition setup will wait.");
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionref.current = recognition;

    recognition.onstart = () => {
      console.log("Recognition started");
      isrecognizingref.current = true;
      setListening(true);
      lastErrorWasAborted.current = false;
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isrecognizingref.current = false;
      setListening(false);

      if (lastErrorWasAborted.current) {
        console.log("Last error was 'aborted'. Delaying restart attempt. Fallback will try later.");
        return;
      }

      if (!isspeakingref.current) {
        console.log("Recognition ended, attempting restart via saferecognition.");
        setTimeout(() => {
          saferecognition();
        }, 500);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isrecognizingref.current = false;
      setListening(false);

      if (event.error === "aborted") {
        lastErrorWasAborted.current = true;
      } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        console.error("Microphone permission denied or service not allowed. Cannot use voice commands.");
        return;
      }

      if (event.error !== "aborted" && event.error !== "no-speech" && !isspeakingref.current) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          console.log(`Retrying recognition (attempt ${retryCountRef.current}) after error: ${event.error}`);
          setTimeout(() => {
            saferecognition();
          }, 1000);
        } else {
          console.error(`Max retries reached for recognition error: ${event.error}. Resetting retry count.`);
          retryCountRef.current = 0;
        }
      }
    };

    recognition.onresult = async (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          transcript += e.results[i][0].transcript;
        }
      }
      transcript = transcript.trim();
      console.log("Heard (final): " + transcript);

      if (transcript && userdata && userdata.assistantname && transcript.toLowerCase().includes(userdata.assistantname.toLowerCase())) {
        console.log("Assistant name detected.");
        try {
            if (typeof geminiresponse === 'function') {
                const data = await geminiresponse(transcript);
                if (data) {
                     handlecommand(data);
                } else {
                    console.warn("geminiresponse returned no data or null.");
                    speak("I couldn't process that command properly.");
                }
            } else {
                console.error("geminiresponse is not a function.");
                speak("There's an issue with my command processing setup.");
            }
        } catch (error) {
            console.error("Error in geminiresponse or handlecommand:", error);
            speak("Sorry, I ran into an issue trying to understand that.");
        }
      } else if (transcript) {
        // Log if assistant name is not detected, but only for debugging if needed
        // console.log("Heard, but assistant name not detected or userdata/assistantname missing for:", transcript);
      }
    };

    console.log("Attempting initial recognition start from useEffect.");
    saferecognition();

    const fallbackInterval = setInterval(() => {
      console.log("Fallback check: attempting saferecognition.");
      saferecognition();
    }, 15000);

    return () => {
      console.log("Cleaning up Home component: stopping recognition and clearing interval.");
      clearInterval(fallbackInterval);
      if (recognitionref.current) {
        recognitionref.current.onstart = null;
        recognitionref.current.onend = null;
        recognitionref.current.onerror = null;
        recognitionref.current.onresult = null;
        recognitionref.current.stop();
        recognitionref.current = null;
      }
      if(synth.current) {
        synth.current.cancel();
      }
    };
  }, [userdata, geminiresponse, saferecognition, handlecommand, speak]);

  return (
    <div className='w-full h-screen bg-gradient-to-t from-black to-[#000088] flex justify-center items-center flex-col p-4'>
      <button
        onClick={handlelogout}
        className='min-w-[100px] h-[40px] bg-white rounded-full text-black font-semibold absolute top-5 right-5 px-4 py-2 shadow-md hover:bg-gray-100 transition-colors'
      >
        Log Out
      </button>

      <button
        onClick={() => navigate('/customize')}
        className='min-w-[100px] h-[40px] bg-white rounded-full text-black font-semibold absolute top-5 left-5 px-4 py-2 shadow-md hover:bg-gray-100 transition-colors'
      >
        Back
      </button>

      <div className='w-[200px] h-[300px] md:w-[250px] md:h-[375px] flex justify-center items-center overflow-hidden rounded-2xl shadow-2xl mb-4'>
        {userdata?.assistantimage ? (
          <img src={userdata.assistantimage} alt={userdata.assistantname || "Assistant"} className='w-full h-full object-cover' />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white p-4 text-center">Assistant image not available.</div>
        )}
      </div>
      <h1 className='text-white text-lg md:text-xl font-semibold mb-2'>
        {userdata?.assistantname ? `I'M ${userdata.assistantname.toUpperCase()}` : "ASSISTANT"}
      </h1>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${listening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </div>
      <p className="text-white mt-2">{listening ? "Listening..." : "Not Listening / Muted"}</p>
       {(!userdata || !userdata.assistantname) && (
        <p className="text-yellow-400 mt-2 text-sm">Assistant not fully configured. Voice commands may be limited.</p>
      )}
      { (typeof window.SpeechRecognition === "undefined" && typeof window.webkitSpeechRecognition === "undefined") && (
         <p className="text-red-400 mt-2 text-sm">Speech Recognition API not supported in this browser.</p>
      )}

    </div>
  );
};

export default Home;