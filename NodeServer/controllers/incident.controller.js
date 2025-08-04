import axios from "axios";
import incidentModel from "../models/incident.model.js";


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

        const newIncidentObject = new incidentModel({
            title,
            description,
            symptoms,
            issuedBy,
            embedding // Save as is, no need to wrap manually
        });

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
const explicitNewIncident = async (req, res) => {
    console.log("Explicitly creating new incident");
    const { title, description, symptoms = [], issuedBy } = req.body;
    if (!title || !description || !issuedBy) {
        return res.status(400).send("Title, description, and issuedBy are required");
    }
    try {

        const embedding = await getEmbedding(textToEmbed);
        console.log("Embedding received");

        if (!Array.isArray(embedding) || embedding.length !== 384) {
            return res.status(400).send("Invalid embedding received");
        }

        const newIncidentObject = new incidentModel({
            title,
            description,
            symptoms,
            embedding,
            issuedBy
        });


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
        const incidents = await incidentModel.find({ issuedBy });
        if (incidents.length === 0) {
            return res.status(404).json("No incidents found for the given issuedBy - - -> " + issuedBy);
        }
        res.status(200).json(incidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).send("Internal Server Error");
    }
}



const incidentResolve = async (req, res) => {
    const { incidentId, resolution, resolvedBy } = req.body;
    if (!incidentId || !resolution || !resolvedBy) {
        return res.status(400).send("incidentId is required");
    }
    try {
        const incident = await incidentModel.findByIdAndUpdate(
            incidentId,
            { resolution, resolvedBy, status: 'resolved' },
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


export { newIncident, getIncidentByIssuedBy, explicitNewIncident, incidentResolve, getUnresolvedIncidents, getIncidentById, getAllIncidents };