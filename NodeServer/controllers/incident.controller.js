import axios from "axios";
import incidentModel from "../models/incident.model.js";
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function generateAIHelpingTipsandSkills(incidentDetails) {
    try {
        const prompt = `
You are an AI assistant. Given the incident details below, do two things:
1. Generate 3-5 **concise helping tips**.
2. Generate 3-5 **skills** needed to resolve the incident.

Return this as **valid JSON** ONLY (no markdown, no backticks, no commentary). Both fields must be arrays of strings.

Incident:
"${incidentDetails}"

Your response:
{
  "helping_tips": ["tip1", "tip2", "..."],
  "skills_needed": ["skill1", "skill2", "..."]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt
        });

        let reportText = response.text.trim();

        reportText = reportText
            .replace(/^```json\s*/, '')
            .replace(/```$/, '')
            .replace(/```/g, '');

        let reportObj;
        try {
            reportObj = JSON.parse(reportText);
        } catch (jsonErr) {
            console.error("Invalid JSON from Gemini:", reportText);
            throw new Error("Gemini returned invalid JSON format.");
        }

        const requiredKeys = ["helping_tips", "skills_needed"];
        for (const key of requiredKeys) {
            if (!(key in reportObj)) reportObj[key] = [];
        }

        if (!Array.isArray(reportObj.helping_tips) || !Array.isArray(reportObj.skills_needed)) {
            throw new Error("Invalid format: Expected arrays");
        }

        console.log("✅ AI Report Generated:", reportObj);
        return reportObj;

    } catch (err) {
        console.error("❌ Error in generateAIHelpingTips:", err.message);
        return null;
    }
}


const getEmbedding = async (text) => {
    const res = await axios.post('http://python-services:5000/embed', {
        sentences: [text],
    });
    const vector = res.data.vectors[0]; // 384-d vector
    return vector;
};

const newIncident = async (req, res) => {
    console.log("Received request to create new incident");
    const { title, description, symptoms = [], issuedBy } = req.body;

    if (!title || !description || !issuedBy) {
        return res.status(400).send("Title, description, and issuedBy are required");
    }

    try {
        const textToEmbed = `${title} ${description} ${symptoms.join(' ')}`;
        console.log("Text to embed:", textToEmbed);
        console.log("Waiting for embedding...");

        const embedding = await getEmbedding(textToEmbed);
        console.log("Embedding received");

        if (!Array.isArray(embedding) || embedding.length !== 384) {
            return res.status(400).send("Invalid embedding received");
        }

        console.log("Checking for similar incidents with embedding");
        const similarIncidents = await findSimilarIncidents(embedding);
        if (similarIncidents && similarIncidents.length > 0) {
            return res.status(409).json({
                message: "Similar incidents already exist",
                similarIncidents: similarIncidents, // ✅ Full objects returned
            });
        }

        console.log("No similar incidents found, proceeding to save new incident");
        console.log("Generating AI helping tips and skills needed from Gemini");
        // Create new incident object generate aiHelpingTips from Gemini and skillsNeeded from Gemini
        const aiReport = await generateAIHelpingTipsandSkills(textToEmbed);
        if (!aiReport) {
            return res.status(500).send("Error generating AI report");
        }

        // Embedded the skillsNeeded
        if (!Array.isArray(aiReport.skills_needed)) {
            return res.status(400).send("Invalid skills_needed format from AI report");
        }
        console.log("Generating skill embeddings for skills needed");
        const skillEmbeddings = await getEmbedding(aiReport.skills_needed.join(' '));
        if (!Array.isArray(skillEmbeddings) || skillEmbeddings.length !== 384) {
            return res.status(400).send("Invalid skill embeddings received");
        }

        console.log("Skill embeddings generated successfully");
        console.log("Requesting user recommendation based on skill embeddings");

        const userRes = await axios.post("http://python-services:5000/recommend-user", {
            skillEmbedding: skillEmbeddings,
        });

        const assignedTo = userRes.data.user_id || null;
        console.log("User recommended for assignment:", assignedTo);

        console.log("Creating new incident object with AI report data");
        const newIncidentObject = new incidentModel({
            title,
            description,
            symptoms,
            issuedBy,
            embedding,
            aiHelpingTips: aiReport.helping_tips,
            skillsNeeded: aiReport.skills_needed,
            skillEmbeddings: skillEmbeddings,
            status: 'open', 
            assignedTo: assignedTo
        });

        console.log("New incident object created:", newIncidentObject);


        await newIncidentObject.save();

        console.log("Refreshing FAISS index with new incident embedding");
        await axios.post("http://python-services:5000/add", {
            id: newIncidentObject._id.toString(),
            embedding: embedding,
        });

        console.log("New incident saved:", newIncidentObject._id);
        return res.status(201).json({
            message: "New incident created successfully",
            incidentId: newIncidentObject._id
        });

    } catch (error) {
        console.error("Error creating new incident:", error.message);
        return res.status(500).send("Internal Server Error");
    }
};

const explicitNewIncident = async (req, res) => {
    console.log("Explicitly creating new incident");
    const { title, description, symptoms = [], issuedBy } = req.body;
    if (!title || !description || !issuedBy) {
        return res.status(400).send("Title, description, and issuedBy are required");
    }
    try {
        const textToEmbed = `${title} ${description} ${symptoms.join(' ')}`;
        console.log("Text to embed:", textToEmbed);
        console.log("Waiting for embedding...");

        const embedding = await getEmbedding(textToEmbed);
        console.log("Embedding received");
        
        if (!Array.isArray(embedding) || embedding.length !== 384) {
            return res.status(400).send("Invalid embedding received");
        }

        //TODO:
        console.log("No similar incidents found, proceeding to save new incident");
        console.log("Generating AI helping tips and skills needed from Gemini");
        // Create new incident object generate aiHelpingTips from Gemini and skillsNeeded from Gemini
        const aiReport = await generateAIHelpingTipsandSkills(textToEmbed);
        if (!aiReport) {
            return res.status(500).send("Error generating AI report");
        }

        // Embedded the skillsNeeded
        if (!Array.isArray(aiReport.skills_needed)) {
            return res.status(400).send("Invalid skills_needed format from AI report");
        }
        console.log("Generating skill embeddings for skills needed");
        const skillEmbeddings = await getEmbedding(aiReport.skills_needed.join(' '));
        if (!Array.isArray(skillEmbeddings) || skillEmbeddings.length !== 384) {
            return res.status(400).send("Invalid skill embeddings received");
        }

        console.log("Skill embeddings generated successfully");
        console.log("Requesting user recommendation based on skill embeddings");

        const userRes = await axios.post("http://python-services:5000/recommend-user", {
            skillEmbedding: skillEmbeddings,
        });

        const assignedTo = userRes.data.user_id || null;
        console.log("User recommended for assignment:", assignedTo);

        console.log("Creating new incident object with AI report data");
        const newIncidentObject = new incidentModel({
            title,
            description,
            symptoms,
            issuedBy,
            embedding,
            aiHelpingTips: aiReport.helping_tips,
            skillsNeeded: aiReport.skills_needed,
            skillEmbeddings: skillEmbeddings,
            status: 'open', 
            assignedTo: assignedTo
        });

        console.log("New incident object created:", newIncidentObject);
        
        await newIncidentObject.save();

        console.log("Refreshing FAISS index with new incident embedding");
        await axios.post("http://python-services:5000/add", {
            id: newIncidentObject._id.toString(),
            embedding: embedding,
        });

        console.log("New incident saved:", newIncidentObject._id);
        return res.status(201).json({
            message: "New incident created successfully",
            incidentId: newIncidentObject._id
        });

    } catch (error) {
        console.error("Error creating new incident:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const findSimilarIncidents = async (embedding) => {
    if (!embedding || !Array.isArray(embedding)) {
        throw new Error("Embedding is required and must be an array");
    }

    try {
        const faissResponse = await axios.post('http://python-services:5000/similar', {
            embedding,
            top_k: 5,
            threshold: 0.3,
        });

        const similar_ids = faissResponse.data.similar_ids;

        if (similar_ids && similar_ids.length > 0) {
            // Fetch full incident objects from DB
            const incidents = await incidentModel.find({
                _id: { $in: similar_ids },
            });

            return incidents;
        } else {
            return null;
        }

    } catch (error) {
        console.error("Error finding similar incidents:", error.message);
        throw error;
    }
};

const getIncidentByIssuedBy = async (req, res) => {
    const { issuedBy } = req.query;
    console.log("Fetching incidents for issuedBy:", issuedBy);

    if (!issuedBy) {
        return res.status(400).send("issuedBy is required");
    }

    try {
        const incidents = await incidentModel.find({ issuedBy }); // <-- 🔥 correct usage

        if (!incidents || incidents.length === 0) {
            return res.status(404).json(`No incidents found for issuedBy: ${issuedBy}`);
        }

        res.status(200).json(incidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).send("Internal Server Error");
    }
};


const incidentResolve = async (req, res) => {
    const { incidentId, resolution, resolvedBy, fixScript } = req.body;
    console.log("Resolving incident with ID:", incidentId);
    console.log("Resolution details:", { resolution, resolvedBy, fixScript });
    
    if (!incidentId || !resolution || !resolvedBy || !fixScript) {
        return res.status(400).send("All Data is required");
    }
    try {
        const incident = await incidentModel.findByIdAndUpdate(
            incidentId,
            { resolution, resolvedBy, status: 'resolved', fixScript },
            { new: true }
        );
        if (!incident) {
            return res.status(404).send("Incident not found");
        }
        res.status(200).json({ message: "Incident resolved successfully", incident });
    } catch (error) {
        console.error("Error resolving incident:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getUnresolvedIncidents = async (req, res) => {
    try {
        const unresolvedIncidents = await incidentModel.find({ status: 'open' });
        if (unresolvedIncidents.length === 0) {
            return res.status(404).json("No unresolved incidents found");
        }
        res.status(200).json(unresolvedIncidents);
    } catch (error) {
        console.error("Error fetching unresolved incidents:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getIncidentById = async (req, res) => {
    const { id } = req.query;
    console.log("Fetching incidents for id:", id);
    if (!id) {
        return res.status(400).send("ID is required");
    }
    try {
        const incidents = await incidentModel.findById(id);
        if (incidents.length === 0) {
            return res.status(404).json("No incidents found for the given id - - -> " + id);
        }
        res.status(200).json(incidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).send("Internal Server Error");
    }
}

const getAllIncidents = async (req, res) => {
    try {
        const incidents = await incidentModel.find();
        if (incidents.length === 0) {
            return res.status(404).json("No incidents found");
        }
        res.status(200).json(incidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).send("Internal Server Error");
    }
}

const getIncidentsByAssignedTo = async (req, res) => {
    const { assignedTo } = req.query;
    console.log("Fetching incidents for assignedTo:", assignedTo);

    if (!assignedTo) {
        return res.status(400).send("assignedTo is required");
    }

    try {
        const incidents = await incidentModel.find({assignedTo: assignedTo});

        if (!incidents || incidents.length === 0) {
            return res.status(404).json(`No incidents found for assignedTo: ${assignedTo}`);
        }

        res.status(200).json(incidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).send("Internal Server Error");
    }
};



export { newIncident, getIncidentByIssuedBy, explicitNewIncident, incidentResolve, getUnresolvedIncidents, getIncidentById, getAllIncidents, getIncidentsByAssignedTo };