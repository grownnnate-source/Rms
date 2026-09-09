import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const isOriginAllowed = (origin, callback) => callback(null, origin || true);

export const io = new SocketIOServer({
  cors: {
    origin: isOriginAllowed,
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

app.use(cors({ origin: isOriginAllowed, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes (supports both /api/* and /* prefixes)
const mountRoutes = (prefix = '') => {
  app.get(`${prefix}/health`, (req, res) => res.status(200).json({ success: true, message: 'Ice Cream Shop API is running smoothly', timestamp: new Date().toISOString() }));
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/payments`, paymentRoutes);
  app.use(`${prefix}/expenses`, expenseRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
};

mountRoutes('/api');
mountRoutes('');

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
