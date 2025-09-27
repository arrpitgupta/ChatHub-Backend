import mongoose from "mongoose";
import dotenv from "dotenv";

import { DB_NAME } from "../constant.js";

dotenv.config();


const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");


    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1); // Exit process if DB connection fails
    }
};

export { connectDb };