import mongoose from "mongoose";

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
    appliedJobs: [{
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        cv: {
            type: String,
            required: true
        }
    }],
});

export default mongoose.model('User',userSchema);