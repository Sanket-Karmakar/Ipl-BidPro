import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import playerRoutes from './routes/player.routes.js';
import matchRoutes from './routes/match.routes.js';
import squadsRoute from './routes/squad.routes.js';
import teamRoutes from "./routes/team.routes.js";
import contestRoutes from './routes/contest.routes.js';   // ✅ contest routes
import scorecardRoutes from './routes/scorecard.routes.js'; // ✅ scorecard + bbb routes
import connectDB from './db/index.js';
import path from "path";
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
app.use('/api/matches', scorecardRoutes); // scorecard + ball-by-ball endpoints
app.use('/api/players', playerRoutes);
app.use('/api', squadsRoute);
app.use("/api/teams", teamRoutes);
app.use('/api/contests', contestRoutes);   // ✅ contest API base path

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

// Connect to DB and start server
const PORT = process.env.PORT || 5005;

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

