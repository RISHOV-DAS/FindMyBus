import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import { calculateETA } from "../utils/eta.js";

export const getLiveBusesByRoute = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const route = await Route.findOne({ routeNumber });
    if (!route) return res.status(404).json({ error: "Route not found" });

    const buses = await Bus.find({ routeNumber: routeNumber, isActive: true });
    const withEta = await Promise.all(
      buses.map(async (b) => {
        const currentStop = route.stops.find(
          (s) => s.lat === b.lat && s.lng === b.lng
        );
        const currentStopIndex = route.stops.findIndex(
          (s) => s.lat === b.lat && s.lng === b.lng
        );
        const isLastStop = currentStopIndex === route.stops.length - 1;

        const eta = await calculateETA(b, route);

        return {
          busId: b.busId,
          routeNumber: b.routeNumber,
          routeName: route.name,
          stopName: currentStop.name,
          lat: b.lat,
          lng: b.lng,
          eta: eta.eta,
          distance: eta.distance,
          nextStopName: isLastStop ? null : b.nextStopName || eta.nextStop,
        };
      })
    );
    res.json(withEta);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const getLiveSingleBus = async (req, res) => {
  try {
    const { routeNumber, busId } = req.params;
    const route = await Route.findOne({ routeNumber });
    if (!route) return res.status(404).json({ error: "Route not found" });

    const bus = await Bus.findOne({ busId, routeNumber, isActive: true });
    if (!bus)
      return res.status(404).json({ error: "Bus not found or inactive" });

    const currentStop = route.stops.find(
      (s) => s.lat === bus.lat && s.lng === bus.lng
    );
    const currentStopIndex = route.stops.findIndex(
      (s) => s.lat === bus.lat && s.lng === bus.lng
    );
    const isLastStop = currentStopIndex === route.stops.length - 1;

    const eta = await calculateETA(bus, route);

    res.json({
      busId: bus.busId,
      routeNumber: bus.routeNumber,
      routeName: route.name,
      stopName: currentStop.name,
      lat: bus.lat,
      lng: bus.lng,
      eta: eta.eta,
      nextStopName: isLastStop ? null : bus.nextStopName || eta.nextStop,
      distance: eta.distance,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const updateBusLocation = async (req, res) => {
  try {
    const { busId, routeNumber, stopName, nextStopName, lat, lng } = req.body;
    if (!busId || !routeNumber)
      return res.status(400).json({ error: "busId and routeNumber required" });

    const route = await Route.findOne({ routeNumber });
    if (!route) return res.status(404).json({ error: "Route not found" });

    const updateFields = {
      routeNumber,
      stopName: stopName || null,
      nextStopName: nextStopName || null,
      lat,
      lng,
      lastUpdated: new Date(),
      isActive: true,
    };

    const bus = await Bus.findOneAndUpdate({ busId }, updateFields, {
      upsert: true,
      new: true,
    });

    const eta = await calculateETA(bus, route);
    const currentStopIndex = route.stops.findIndex(
      (s) => s.lat === bus.lat && s.lng === bus.lng
    );
    const isLastStop = currentStopIndex === route.stops.length - 1;

    const busData = {
      ...bus.toObject(),
      routeName: route.name,
      eta: eta.eta,
      nextStopName: isLastStop ? null : bus.nextStopName || eta.nextStop,
      distance: eta.distance,
    };

    const busesInRoute = await Bus.find({ routeNumber, isActive: true });
    const busesWithData = await Promise.all(
      busesInRoute.map(async (b) => {
        const busEta = await calculateETA(b, route);
        const busStopIndex = route.stops.findIndex(
          (s) => s.lat === b.lat && s.lng === b.lng
        );
        const isBusLastStop = busStopIndex === route.stops.length - 1;

        return {
          ...b.toObject(),
          routeName: route.name,
          eta: busEta.eta,
          nextStopName: isBusLastStop
            ? null
            : b.nextStopName || busEta.nextStop,
          distance: busEta.distance,
        };
      })
    );

    if (req.io) {
      req.io.to(`route:${routeNumber}`).emit("route:update", busesWithData);
      req.io.to(`bus:${busId}`).emit("bus:update", busData);
    }

    res.json(busData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
