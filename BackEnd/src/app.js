import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'

dotenv.config({path: './env'});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port : ${process.env.PORT}`);
});

export { app };

