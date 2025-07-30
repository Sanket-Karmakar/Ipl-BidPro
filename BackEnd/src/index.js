import dotenv from 'dotenv';
dotenv.config({path: './env'});

import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db/index.js';

const app = express()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Example app listening on port : ', process.env.PORT)
    })
})
.catch((err) => {
    console.log('MongoDB connection failed : ', err)
})

