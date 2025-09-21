import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { usePeer } from '../Providers/PeerProvider';

const Room = () => {
  const socket = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStreams } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState("");
  const videoRef = useRef(null);

  const handleNewUser = useCallback(async (data) => {
    const { email } = data;
    console.log("New user joined:", email);
    const offer = await createOffer();
    socket.emit('call-user', { email, offer });
    setRemoteEmailId(email);
  }, [createOffer, socket]);

  const handleIncomingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("Received offer:", offer);
    const answer = await createAnswer(offer);
    socket.emit('call-accepted', { emailId: from, answer });
    setRemoteEmailId(from);
  }, [createAnswer, socket]);

  const handleCallAccepted = useCallback(async (data) => {
    const { answer } = data;
    await setRemoteAns(answer);
  }, [setRemoteAns]);

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setMyStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera/mic. Close other apps or check permissions.");
    }
  }, []);

  useEffect(() => {
    socket.on('user-joinning', handleNewUser);
    socket.on('incomming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);

    return () => {
      socket.off('user-joinning', handleNewUser);
      socket.off('incomming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
    };
  }, [socket, handleNewUser, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  const negotiationHandler = useCallback(() => {
    if (peer.localDescription && remoteEmailId) {
      socket.emit('call-user', { email: remoteEmailId, offer: peer.localDescription });
    }
  }, [peer.localDescription, remoteEmailId, socket]);

  useEffect(() => {
    peer.addEventListener('negotiationneeded', negotiationHandler);
    return () => peer.removeEventListener('negotiationneeded', negotiationHandler);
  }, [peer, negotiationHandler]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h4>Connected to: {remoteEmailId}</h4>
      <button
        onClick={() => {
          if (myStream) sendStream(myStream);
          else alert("No stream available!");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Share My Stream
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "300px", borderRadius: "12px", background: "black" }}
      />

      <div className="flex flex-wrap gap-4">
        {remoteStreams.map((stream, index) => (
          <video
            key={stream.id || index}
            autoPlay
            playsInline
            style={{ width: "300px", borderRadius: "12px", background: "black" }}
            ref={(el) => {
              if (el) el.srcObject = stream;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Room;
