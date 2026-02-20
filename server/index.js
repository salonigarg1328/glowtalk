import express from 'express';
import dotenv from 'dotenv/config';
import mongoDBConnect from './mongoDB/connection.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import { Server } from 'socket.io'; // ✅ FIX: Correct import

const app = express();

const PORT = process.env.PORT || 8000;

// ============= CORS CONFIG =============
const corsConfig = {
  origin:[
    process.env.BASE_URL, // http://localhost:3000'
    'https://glowtalk.vercel.app',
  ],
  
  credentials: true,
};

// ============= MIDDLEWARE (ORDER IS IMPORTANT!) =============
app.use(cors(corsConfig));

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= ROUTES =============
app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ============= MONGODB CONNECTION =============
mongoose.set('strictQuery', false);
mongoDBConnect();

// ============= SERVER START =============
const server = app.listen(PORT, () => {
  console.log(`🚀 Server Listening at PORT - ${PORT}`);
  console.log(`🌐 CORS enabled for: ${process.env.BASE_URL}`);
});

// ============= SOCKET.IO SETUP =============
const io = new Server(server, { // ✅ FIX: Use Server directly, not Server.Server
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
    console.log('👤 User joined:', userData.id);
  });

  socket.on('join room', (room) => {
    socket.join(room);
    console.log('🏠 User joined room:', room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieve) => {
    console.log('📨 New message received:', newMessageRecieve);
    
    // Validate message data
    if (!newMessageRecieve || !newMessageRecieve.chatId) {
      console.error('❌ Invalid message data');
      return;
    }
    
    var chat = newMessageRecieve.chatId;
    
    // Validate chat users
    if (!chat || !chat.users || !Array.isArray(chat.users)) {
      console.error('❌ chat.users is not defined or not an array');
      return;
    }
    
    console.log('✅ Broadcasting to', chat.users.length, 'users');
    
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieve.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageRecieve);
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});