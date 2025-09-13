import fetch from "node-fetch";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Route from "./models/Route.js";

dotenv.config();
await mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/bus_tracker"
);

async function loadRoute(routeNumber) {
  const r = await Route.findOne({ routeNumber });
  if (!r) throw new Error("Route not found");
  return r;
}

async function simulateBus(busId, routeNumber) {
  const route = await loadRoute(routeNumber);
  let idx = 0;
  const totalStops = route.stops.length;

  const intervalId = setInterval(async () => {
    const currentStop = route.stops[idx];
    const isLastStop = idx === totalStops - 1;

    try {
      const nextStopName = isLastStop ? null : route.stops[idx + 1].name;

      const res = await fetch("http://localhost:5000/api/buses/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busId,
          routeNumber,
          stopName: currentStop.name,
          nextStopName: nextStopName,
          lat: currentStop.lat,
          lng: currentStop.lng,
        }),
      });

      const json = await res.json();
      console.log("Sim update", {
        busId: json.busId || busId,
        currentStop: currentStop.name,
        nextStop: nextStopName || "End of route",
        position: { lat: currentStop.lat, lng: currentStop.lng },
        isLastStop,
      });

      if (isLastStop) {
        console.log(`🚌 ${busId} has completed the route!`);
        clearInterval(intervalId);
      } else {
        idx++;
      }
    } catch (e) {
      console.error("Sim error:", e.message);
      clearInterval(intervalId);
    }
  }, 5000);

  return intervalId;
}

simulateBus("BUS101", "101");
simulateBus("BUS102", "101");
