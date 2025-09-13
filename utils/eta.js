import axios from "axios";
import { haversineMeters } from "./haversine.js";

const GMAPS_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export async function calculateETA(bus, route) {
  try {
    if (!route || !route.stops || route.stops.length === 0) {
      throw new Error("Route stops missing");
    }

    const stops = route.stops.map((s) => `${s.lat},${s.lng}`);
    const origin = `${bus.lat},${bus.lng}`;
    const destination = stops[stops.length - 1];
    const waypoints = stops.slice(0, -1).join("|");

    if (!GMAPS_KEY) {
      throw new Error("No Google API key, fallback to haversine");
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ""
    }&departure_time=now&key=${GMAPS_KEY}`;
    const resp = await axios.get(url, { timeout: 5000 });
    const data = resp.data;

    if (
      data.routes &&
      data.routes.length > 0 &&
      data.routes[0].legs &&
      data.routes[0].legs.length > 0
    ) {
      const leg = data.routes[0].legs[0];

      // Find the next stop
      let nextStop = null;
      const busPosition = { lat: bus.lat, lng: bus.lng };
      let minDistance = Infinity;

      for (const stop of route.stops) {
        const distance = haversineMeters(
          busPosition.lat,
          busPosition.lng,
          stop.lat,
          stop.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          nextStop = stop;
        }
      }

      return {
        eta: leg.duration_in_traffic?.text ?? leg.duration?.text,
        distance: leg.distance?.text ?? null,
        nextStop: nextStop?.name || null,
      };
    }
    throw new Error("No route from Google");
  } catch (err) {
    const last = route.stops[route.stops.length - 1];
    const meters = haversineMeters(bus.lat, bus.lng, last.lat, last.lng);
    const avgSpeedKmph = 30;
    const etaMins = Math.round((meters / 1000 / avgSpeedKmph) * 60);
    let nextStop = null;
    const busPosition = { lat: bus.lat, lng: bus.lng };
    let minDistance = Infinity;

    for (const stop of route.stops) {
      const distance = haversineMeters(
        busPosition.lat,
        busPosition.lng,
        stop.lat,
        stop.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nextStop = stop;
      }
    }

    return {
      eta: `${etaMins} mins (approx)`,
      distance: `${(meters / 1000).toFixed(2)} km`,
      nextStop: nextStop?.name || null,
    };
  }
}
