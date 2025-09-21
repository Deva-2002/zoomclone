import React, { useEffect, useCallback, useState, useMemo, createContext, useContext } from 'react';

const PeerContext = createContext(null);
export const usePeer = () => useContext(PeerContext);

const PeerProvider = ({ children }) => {
  const [remoteStreams, setRemoteStreams] = useState([]);

  const peer = useMemo(() => new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }), []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAns = async (answer) => await peer.setRemoteDescription(answer);

  const sendStream = (stream) => {
    if (!stream) return console.warn("No stream to send!");
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
  };

  const handleTrackEvent = useCallback((ev) => {
    const newStream = ev.streams[0];
    if (!remoteStreams.find(s => s.id === newStream.id)) {
      setRemoteStreams(prev => [...prev, newStream]);
    }
  }, [remoteStreams]);

  useEffect(() => {
    peer.addEventListener('track', handleTrackEvent);
    return () => peer.removeEventListener('track', handleTrackEvent);
  }, [peer, handleTrackEvent]);

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStreams }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
