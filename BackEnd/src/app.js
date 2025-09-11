import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import playerRoutes from './routes/player.routes.js';
import matchRoutes from './routes/match.routes.js';
import connectDB from './db/index.js';
import './jobs/scheduler.js';

// Load environment variables
dotenv.config({ path: '.env' });

// Create app
const app = express();

// CORS (adjust origin if frontend is hosted elsewhere later)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));


// Health check
app.get('/', (_req, res) => {
  res.send({ status: 'ok', message: 'IPL BidPro backend is running' });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "crickbid-backend" });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});


// Connect to DB and start server
const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    console.log('MongoDB connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

