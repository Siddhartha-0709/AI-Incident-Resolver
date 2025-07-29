import { Router } from "express";
import { newIncident, getIncident, incidentResolve, explicitNewIncident, getUnresolvedIncidents } from "../controllers/incident.controller.js";

const router = Router();

router.route('/new-incident').post(newIncident);
router.route('/get-incident').get(getIncident);
router.route('/explicit-new-incident').post(explicitNewIncident);
router.route('/incident-resolve').post(incidentResolve);
router.route('/incident-open').get(getUnresolvedIncidents);

export default router;