import React, { useContext } from 'react'
import { BrowserRouter, Navigate, Route,Routes } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Customize from './pages/Customize'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'
import { userdatacontext } from './context/Usercontext'

const App = () => {
  const{userdata}=useContext(userdatacontext)
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={(userdata?.assistantimage && userdata?.assistantname) ? <Home/>:<Navigate to={"/customize"}/>}/>
      <Route path='/signup' element={!userdata ? <Register/> : <Navigate to={"/"}/>} />
      <Route path='/signin' element={!userdata ? <Login/>:<Navigate to={"/"}/>}/>
      <Route path='/customize' element={userdata?<Customize/>:<Navigate to={"/signup"}/>}/>
      <Route path='/customize2' element={userdata?<Customize2/>:<Navigate to={"/signup"}/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App