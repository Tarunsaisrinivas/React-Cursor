// lib/db.js
import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!process.env.MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI, {
                bufferCommands: false,
            })
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
