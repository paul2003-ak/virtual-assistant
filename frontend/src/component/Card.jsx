import React, { useContext } from 'react'
import { userdatacontext } from '../context/Usercontext'

const Card = ({image , selectimage , setSelectimage}) => {
  const{setBackendimage,setFrontendimage}=useContext(userdatacontext)
  return (
    <div onClick={()=>{
        setSelectimage(image)
        setBackendimage(null)
        setFrontendimage(null)
    }}
     className={`w-[80px] h-[130px] lg:w-[100px] lg:h-[150px] bg-blue-950 border-2 border-[#0606fb62] rounded-2xl overflow-hidden 
    hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white
    ${selectimage==image ? "border-4 border-white shadow-2xl shadow-blue-950": null} `}>

        <img src={image } className='h-full w-full object-cover rounded-2xl'/>

    </div> 
  )
}

export default Card