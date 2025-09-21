import React from 'react'
import { useMemo } from 'react';
import { useContext } from 'react';
import { createContext } from 'react'
import { io } from 'socket.io-client';

const socketContext=createContext(null);

export const useSocket=()=>{
    return useContext(socketContext);
}

const SocketProvider = ({children}) => {
    const socket=useMemo(()=>{
       return io("http://localhost:8000");
    },[])
  return (
    <socketContext.Provider value={socket}>
        {children}
    </socketContext.Provider>
  )
}

export default SocketProvider
