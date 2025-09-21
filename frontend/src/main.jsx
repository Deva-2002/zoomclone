import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SocketProvider from './Providers/SocketProvider.jsx'
import PeerProvider from './Providers/PeerProvider.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <PeerProvider>
      <App />
    </PeerProvider>
  </SocketProvider>

)
