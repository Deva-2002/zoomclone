import express from "express";
import { Server, Socket } from "socket.io";

const app = express();
app.use(express.json());

const io = new Server({
    cors: "*"
})

const emailToSocketMap = new Map();
const socketToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on('join-room', ({ roomId, email }) => {
    emailToSocketMap.set(email, socket.id);
    socketToEmailMap.set(socket.id, email);
    socket.join(roomId);
    socket.emit('joined-room', { roomId });
    socket.broadcast.to(roomId).emit('user-joinning', { email });
  });

  socket.on('call-user', ({ email, offer }) => {
    const socketId = emailToSocketMap.get(email);
    const from = socketToEmailMap.get(socket.id);
    if (socketId) socket.to(socketId).emit('incomming-call', { from, offer });
  });

  socket.on('call-accepted', ({ emailId, answer }) => {
    const socketId = emailToSocketMap.get(emailId);
    if (socketId) socket.to(socketId).emit('call-accepted', { answer });
  });

  socket.on('disconnect', () => {
    const email = socketToEmailMap.get(socket.id);
    if (email) emailToSocketMap.delete(email);
    socketToEmailMap.delete(socket.id);
  });
});


app.listen(3000, () => {
    console.log("listening to port 3000");
})

io.listen(8000);
