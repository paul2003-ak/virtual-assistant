import React, { useContext, useState } from 'react'
import bg1 from '../assets/authBg.png'
import toast from 'react-hot-toast'
import axios from 'axios'

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { userdatacontext } from '../context/Usercontext';

console.log(bg1)

const Register = () => {
    const { setUserdata}=useContext(userdatacontext)//comes from usercontext.jsx

    const [showpassword, setShowpassword] = useState(false)
    const navigate = useNavigate()

    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")//for show the error in frontend those comes from backend 

    const submithandler = async (e) => {
        e.preventDefault();

        setError("");//for new error

        const newuser = {
            fullname: fullname,
            email: email,
            password: password
        }

        try {
            const response = await axios.post("http://localhost:3000/user/register", newuser,{withCredentials:true});
            console.log("response", response.status);

            if (response.status == 201) {
                const data = response.data

                toast.success(data.message || "User Register successfully!")//use toast

                setUserdata(data)//** */

                navigate("/customize")

            }

        } catch (error) {
            console.log(error)

            setUserdata(null)

            setError(error.response.data.massage)//store the errors any we will show it when wrror comes ..
        }

        setFullname("")
        setEmail("")
        setPassword("")
    };

    return (
        <>
            <div className='w-full h-[100vh] bg-cover  flex justify-center items-center' style={{ backgroundImage: `url(${bg1})` }}>

                <form onSubmit={submithandler} className='px-[20px] w-[80%] h-[400px] max-w-[500px] bg-[#0000004c] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]'>

                    <h1 className='text-white text-[30px] font-semibold mb-30px'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>

                    <input value={fullname}
                        onChange={(e) => { setFullname(e.target.value) }}
                        type="text" placeholder='Enter Your Name' className='w-full h-60px outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[5px] rounded-full text-[18px] ' />

                    <input value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email" placeholder='Email' className='w-full h-60px outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[5px] rounded-full text-[18px] ' />

                    <div className='w-full h-60px border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>

                        <input value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type={showpassword ? "text" : "password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[5px]' />

                        {/* when showpassword is false */}
                        {!showpassword && <IoMdEye onClick={() => {
                            setShowpassword(true)
                        }} className='absolute top-[7px] right-[20px] text-white h-[20px] cursor-pointer ' />}

                        {/* when showpassword is true */}
                        {showpassword && <IoMdEyeOff onClick={() => {
                            setShowpassword(false)
                        }} className='absolute top-[7px] right-[20px] text-white h-[20px] cursor-pointer ' />}

                    </div>
                        
                        {/* show the error */}
                    {error.length > 0 && <p className='text-red-500 '>*{error}</p>}

                    <button className='min-w-[120px] h-[40px] bg-white  rounded-full  text-black font-semibold mt-[20px] '>Sign Up</button>


                    <p className='text-white text-[12px] cursor-pointer '>Already Have an account ? <span onClick={() => { navigate("/signin") }} className='text-blue-500'>Sign In</span></p>

                </form>
            </div>
        </>
    )
}

export default Register