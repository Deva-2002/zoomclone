import React from 'react'
import { useState } from 'react'
import { useSocket } from '../Providers/SocketProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const socket = useSocket();
    const navigate=useNavigate();

    const handleJoinedRoom=(data)=>{
        const {roomId}=data;
        navigate(`/room/${roomId}`);
    }

    useEffect(()=>{
        socket.on('joined-room',handleJoinedRoom)
    },[socket])

    function handleRoom() {
        socket.emit("join-room", { roomId: room, email: email });
    }
    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center gap-3'>
            <input onChange={(e) => {
                setEmail(e.target.value)
            }} className='p-2 rounded-xl w-[30%] border border-black' placeholder='enter your email...'></input>
            <input onChange={(e) => {
                setRoom(e.target.value)
            }} className='p-2 w-[30%] rounded-xl border border-black' placeholder='enter your roomId...'></input>
            <button onClick={handleRoom} className='p-2 w-[20%] bg-slate-700 text-white rounded-xl'>Create Room</button>
        </div>
    )
}

export default Home
