import express from 'express';
import { getLiveBusesByRoute, getLiveSingleBus, updateBusLocation } from '../controllers/busController.js';
const router = express.Router();

// GET all live buses with ETA for a route
router.get('/live/:routeNumber', getLiveBusesByRoute);

// GET single bus with ETA
router.get('/live/:routeNumber/:busId', getLiveSingleBus);

// Update bus location (simulator / driver)
router.post('/update', updateBusLocation);

export default router;
