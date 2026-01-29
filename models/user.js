import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    verificationStatus: {
        type: String,
        enum: ["unverified", "pending", "verified"],
        default: "unverified",
    },
    verificationRequestedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);