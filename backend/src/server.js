import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

export const io = new SocketIOServer({
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});

//.on('event', callback) -> is nodes event listner.
io.on('connection', (socket) => {
  console.log(`🔌 Staff connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Staff disconnected: ${socket.id}`);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ice Cream Shop API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  io.attach(
    app.listen(PORT, () => {
      console.log(`🍦 Server listening on port ${PORT}`);
    })
  );
});
