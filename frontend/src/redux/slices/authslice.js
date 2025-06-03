import {createSlice} from '@reduxjs/toolkit'

const initialState={
    Auth:null,
    isAuthenticated: false,
    customizationDone: false, // <-- new flag
}

export const  AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setAuth:(state,action)=>{
            state.Auth=action.payload
            state.isAuthenticated = true
        },
        setCustomizationDone: (state, action) => {
            state.customizationDone = action.payload
        },
        logout:(state)=>{
            state.Auth=null
            state.isAuthenticated = false
            state.customizationDone = false
        }
    }
})

export const {setAuth,logout,setCustomizationDone}=AuthSlice.actions
export default AuthSlice.reducer