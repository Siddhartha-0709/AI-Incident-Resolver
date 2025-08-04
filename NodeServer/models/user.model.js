import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'resolver', 'admin'],
        default: 'user',
    },
    skills: {
        type: [String],
        default: [],
    },
    skillEmbeddings:{
        type: [],
        default: [],
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);