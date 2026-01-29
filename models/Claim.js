import mongoose from "mongoose";

const claimSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    deal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Deal",
    },
    status:{
        type:String,
        enum:["pending","approved"],
        default:"pending",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

export default mongoose.model("Claim",claimSchema);