import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "554957789360-s9oa7fe7jso81mhjbqms1diehdupsuhl.apps.googleusercontent.com";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>

      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
