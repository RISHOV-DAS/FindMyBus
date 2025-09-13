import express from "express";
import { getRoutes, getRouteByNumber } from "../controllers/routeController.js";
const router = express.Router();
router.get("/", getRoutes);
router.get("/:routeNumber", getRouteByNumber);
export default router;
