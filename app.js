import express from 'express';
import cors from 'cors';
import incidentRoutes from './router/incident.route.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/v1/incident", incidentRoutes);

export default app;