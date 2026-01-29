import mongoose from "mongoose";

const dealSchema =new mongoose.Schema({
    title:String,
    description:String,
    category:String,
    isLocked:{
        type:Boolean,
        default:true,
    },
});

export default mongoose.model("Deal",dealSchema);