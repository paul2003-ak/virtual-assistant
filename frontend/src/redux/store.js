import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { rootReducers } from "./reducer/reducer"; // Make sure this is an object of reducers

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist the 'auth' slice
};

// Combine persist config with your root reducers
const persistedReducer = persistReducer(persistConfig, rootReducers);

// Configure store with middleware fix
export const store = configureStore({
  reducer: persistedReducer,//this is main 

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);