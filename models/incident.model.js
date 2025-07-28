import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    issuedBy: {
        type: String,
        required: true,
    },
    symptoms: {
        type: [String],
        default: [],  
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open',
    },
    resolution: {
        type: String,
        default: '',
    },
    resolvedBy: {
        type: String,
        default: '',
    },
    embedding:{
        type: [],
        default: [],
    },
},{timestamps: true});

export default mongoose.model('Incident', incidentSchema);