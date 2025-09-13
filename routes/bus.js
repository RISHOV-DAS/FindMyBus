import express from "express";
import {
  getLiveBusesByRoute,
  getLiveSingleBus,
  updateBusLocation,
} from "../controllers/busController.js";
const router = express.Router();

router.get("/live/:routeNumber", getLiveBusesByRoute);

router.get("/live/:routeNumber/:busId", getLiveSingleBus);

router.post("/update", updateBusLocation);

export default router;
