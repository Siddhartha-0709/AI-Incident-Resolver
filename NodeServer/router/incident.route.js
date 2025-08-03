import { Router } from "express";
import { newIncident, getIncidentByIssuedBy, incidentResolve, explicitNewIncident, getUnresolvedIncidents,getIncidentById, getAllIncidents } from "../controllers/incident.controller.js";

const router = Router();

router.route('/new-incident').post(newIncident);
router.route('/get-incident').get(getIncidentByIssuedBy);
router.route('/explicit-new-incident').post(explicitNewIncident);
router.route('/incident-resolve').post(incidentResolve);
router.route('/incident-open').get(getUnresolvedIncidents);
router.route('/incident-by-id').get(getIncidentById);
router.route('/get-all').get(getAllIncidents);



export default router;