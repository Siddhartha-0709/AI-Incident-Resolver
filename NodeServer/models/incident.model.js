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
    embedding: {
        type: [],
        default: [],
    },
    fixScript: {
        type: String,
        default: '',
    },
    skillsNeeded: {
        type: [String],
        default: [],
    },
    skillEmbeddings: {
        type: [],
        default: [],
    },
    aiHelpingTips: {
        type: [String], 
        default: [],
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        default: null
    }

}, { timestamps: true });

export default mongoose.model('Incident', incidentSchema);