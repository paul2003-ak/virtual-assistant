import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const  userdatacontext=createContext()
const Usercontext = ({children}) => {
    const serverurl="http://localhost:3000"

    const [userdata, setUserdata] = useState(null)
    const [frontendimage, setFrontendimage] = useState(null)
    const [ backendimage, setBackendimage] = useState(null)
    const [selectimage, setSelectimage] = useState(null);

    const handlecurrentuser=async ()=>{
         try{
            const result=await axios.get("https://virtual-assistant-ayan-backend.onrender.com/user/profile",{withCredentials:true})
            setUserdata(result.data)
            console.log(result.data)
         }catch(error){
            console.log(error)
         }
    }

    useEffect(()=>{
        handlecurrentuser()
    },[])


    const geminiresponse=async(command)=>{
      try{
        const result=await axios.post("https://virtual-assistant-ayan-backend.onrender.com/user/command",{command},{withCredentials:true})
        return result.data
      }catch(error){
        console.log(error)
      }
    }



    const value={
        serverurl,userdata, setUserdata,
        backendimage, setBackendimage,
        frontendimage, setFrontendimage,
        selectimage, setSelectimage,
        geminiresponse
    }
  return (
    <div> 
        <userdatacontext.Provider value={value}>
        {children }
        </userdatacontext.Provider>
    </div>
  )
}

export default Usercontext
