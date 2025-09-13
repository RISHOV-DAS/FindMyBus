import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import { calculateETA } from '../utils/eta.js';

export const getLiveBusesByRoute = async (req,res)=>{
  try{
    const { routeNumber } = req.params;
    const route = await Route.findOne({ routeNumber });
    if(!route) return res.status(404).json({ error: 'Route not found' });

    const buses = await Bus.find({ routeNumber: routeNumber, isActive: true });
    const withEta = await Promise.all(buses.map(async (b)=>{
      const stop=route.stops.find(s=>s.lat===b.lat && s.lng===b.lng);
      const eta = await calculateETA(b, route);
      return {
        busId: b.busId,
        routeNumber: b.routeNumber,
        stopName: stop.name,
        lat: b.lat,
        lng: b.lng,
        eta: eta.eta,
        distance: eta.distance
      };
    }));
    res.json(withEta);
  }catch(e){
    console.error(e); res.status(500).json({ error: e.message });
  }
};

export const getLiveSingleBus = async (req,res)=>{
  try{
    const { routeNumber, busId } = req.params;
    const route = await Route.findOne({ routeNumber });
    if(!route) return res.status(404).json({ error: 'Route not found' });

    const bus = await Bus.findOne({ busId, routeNumber, isActive: true });
    if(!bus) return res.status(404).json({ error: 'Bus not found or inactive' });
    const stop=route.stops.find(s=>s.lat===bus.lat && s.lng===bus.lng);
    const eta = await calculateETA(bus, route);
    res.json({
      busId: bus.busId,
      routeNumber: bus.routeNumber,
      stopName:stop.name,
      lat: bus.lat,
      lng: bus.lng,
      eta: eta.eta,
      distance: eta.distance
    });
  }catch(e){
    console.error(e); res.status(500).json({ error: e.message });
  }
};

export const updateBusLocation = async (req,res)=>{
  try{
    const { busId, routeNumber, lat, lng } = req.body;
    if(!busId || !routeNumber) return res.status(400).json({ error: 'busId and routeNumber required' });

    const bus = await Bus.findOneAndUpdate({ busId }, { routeNumber, lat, lng, lastUpdated: new Date(), isActive:true }, { upsert:true, new:true });
    // emit via socket if available
    if(req.io) req.io.to(`route:${routeNumber}`).emit('bus:update', bus);
    if(req.io) req.io.to(`bus:${busId}`).emit('bus:update', bus);
    res.json(bus);
  }catch(e){ console.error(e); res.status(500).json({ error: e.message }); }
};
