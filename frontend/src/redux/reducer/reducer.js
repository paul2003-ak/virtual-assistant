import { combineReducers } from "@reduxjs/toolkit";
import Authslice from "../slices/authslice";

const rootReducers=combineReducers({
    auth:Authslice
})

export {rootReducers}

