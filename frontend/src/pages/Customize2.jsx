import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userdatacontext } from '../context/Usercontext'
import axios from 'axios'
import { IoArrowBackOutline } from "react-icons/io5";

const Customize2 = () => {
    const {userdata,backendimage,selectimage,setUserdata}=useContext(userdatacontext)

    const [assistantname, setAssistantname] = useState(userdata?.assistantname || "")

    const navigate=useNavigate()
    const auth=useSelector((state)=>state.auth)//redux work
    const data=auth.Auth

    useEffect(() => {//its for security is no data is present in redux so do not show the home page 
        if (!data) {
          navigate('/signin')
        }
      }, [data])

      const handleupdateassistant=async ()=>{
         try{
            let formdata=new FormData()
            formdata.append("assistantname",assistantname)
            if(backendimage){
                formdata.append("assistantimage",backendimage)//if i have backend image send backendimage othewise send selected image 
            }else{
                formdata.append("imageurl",selectimage)
            }
            const result=await axios.post("https://virtual-assistant-ayan-backend.onrender.com/updateassistant",formdata,{withCredentials:true})

            setUserdata(result.data)
            console.log(userdata)
            
            navigate('/')
         }catch(error){
             console.log(error)
         }
      }

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[blue] flex justify-center items-center flex-col p-[20px] relative '>
            <IoArrowBackOutline onClick={()=>navigate('/customize')} className='absolute top-[30px] left-[30px] text-white w-[30px] h-[20px] cursor-pointer '/>

            <h1 className='text-white text-[30px] text-center mb-[30px]'>Enter Your <span className='text-blue-200'>Assistant Name</span></h1>

            <input value={assistantname} onChange={(e)=>{
                setAssistantname(e.target.value)
            }} type="text" placeholder='eg:jervise' className='w-full h-60px max-w-[500px] outline-none border-2 border-white bg-transparent text-white
             placeholder-gray-300 px-[20px] py-[5px] rounded-full text-[18px] placeholder:text-[15px]' />
            
            {assistantname && <button onClick={() =>{
                handleupdateassistant()
            }} className='min-w-[120px] h-[40px] bg-white  rounded-full  text-black font-semibold mt-[30px] cursor-pointer '> Next</button>}
            
        </div>
    )
}

export default Customize2
