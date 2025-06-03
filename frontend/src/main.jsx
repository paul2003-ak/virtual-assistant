import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from 'react-redux'
import { store ,persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import Usercontext from './context/Usercontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Usercontext>
    <App />
    </Usercontext>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
