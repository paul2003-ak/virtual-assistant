import React, { useContext, useEffect, useRef } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import image1 from '../assets/image1.png'
import image2 from '../assets/authBg.png'
import image3 from '../assets/image2.jpg'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image7.jpeg'
import { LuImagePlus } from "react-icons/lu";

import Card from '../component/Card'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userdatacontext } from '../context/Usercontext'

const Customize = () => {
    const { setBackendimage, frontendimage, setFrontendimage, selectimage, setSelectimage } = useContext(userdatacontext)//come from usercontext.jsx



    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)//redux work
    const data = auth.Auth

    useEffect(() => {//its for security is no data is present in redux so do not show the home page 
        if (!data) {
            navigate('/signin')
        }
    }, [data])


    const inputimage = useRef()

    const handleimage = (e) => {
        const file = e.target.files[0]
        setBackendimage(file)//the full file save in backend
        setFrontendimage(URL.createObjectURL(file))//we turn the file into url and save here 
    }
    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[blue] flex justify-center items-center flex-col p-[20px] '>

            <IoArrowBackOutline onClick={() => navigate('/')} className='absolute top-[30px] left-[30px] text-white w-[30px] h-[20px] cursor-pointer ' />

            <h1 className='text-white text-[30px] text-center mb-[30px]'>Select Your <span className='text-blue-200'>Assistant Image</span></h1>

            <div className='w-[90%] max-w-[500px] flex justify-center items-center flex-wrap gap-[10px] '>
                <Card image={image1} selectimage={selectimage} setSelectimage={setSelectimage} />
                <Card image={image2} selectimage={selectimage} setSelectimage={setSelectimage} />
                <Card image={image3} selectimage={selectimage} setSelectimage={setSelectimage} />
                <Card image={image4} selectimage={selectimage} setSelectimage={setSelectimage} />
                <Card image={image5} selectimage={selectimage} setSelectimage={setSelectimage} />
                <Card image={image6} selectimage={selectimage} setSelectimage={setSelectimage} />

                <div onClick={() => {
                    inputimage.current.click()
                    setSelectimage("input")
                }}
                    className={`w-[80px] h-[130px] lg:w-[100px] lg:h-[150px] bg-blue-950 border-2 border-[#0606fb62] rounded-2xl overflow-hidden 
    hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4
        hover:border-white flex items-center justify-center
         ${selectimage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}>

                    {/* when we have not frontend image then show this icon */}
                    {!frontendimage && <LuImagePlus className='text-white w-[20px] h-[20px] ' />}
                    {frontendimage && <img src={frontendimage} className='h-full w-full object-cover rounded-2xl' />}

                </div>

                <input onChange={handleimage} ref={inputimage} type="file" accept='image/*' hidden />

            </div>

            {selectimage && <button onClick={() => navigate('/customize2')} className='min-w-[120px] h-[40px] bg-white  rounded-full  text-black font-semibold mt-[30px] cursor-pointer '> Next</button>
            }

        </div>
    )
}

export default Customize