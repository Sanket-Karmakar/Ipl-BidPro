import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.error("MongoDB connection ERROR : ", error);
        throw err;
    }
}

export default connectDB;






/*

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express from 'express';
import { DB_NAME } from '../constants';

const app = express();

( async() => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("ERROR : ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`Example app listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log(error);
        throw error
    }
})()

*/

