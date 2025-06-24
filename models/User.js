import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    appliedJobs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    }],
});

export default mongoose.model('User',userSchema);