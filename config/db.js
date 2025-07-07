import mongoose from "mongoose";
mongoose.set('sanitizeFilter', true);
export const ConnectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected: ",conn.connection.host);
    } catch (error) {
        console.log("Failed to connect: ",error);
    }
}