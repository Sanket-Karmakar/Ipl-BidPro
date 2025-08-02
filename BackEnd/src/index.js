import dotenv from 'dotenv';
dotenv.config({path: './env'});

import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db/index.js';
import { app } from './app.js'

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Server running on port : ', process.env.PORT)
    })
})
.catch((err) => {
    console.log('MongoDB connection failed : ', err)
});

