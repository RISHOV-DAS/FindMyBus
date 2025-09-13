import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Route from './models/Route.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bus_tracker');

async function loadRoute(routeNumber){
  const r = await Route.findOne({ routeNumber });
  if(!r) throw new Error('Route not found');
  return r;
}

async function simulateBus(busId, routeNumber){
  const route = await loadRoute(routeNumber);
  let idx = 0;
  setInterval(async ()=>{
    const stop = route.stops[idx];
    idx = (idx+1) % route.stops.length;
    try{
      const res = await fetch('http://localhost:5000/api/buses/update', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ busId, routeNumber, lat: stop.lat, lng: stop.lng })
      });
      const json = await res.json();
      console.log('Sim update', json.busId ?? json);
    }catch(e){
      console.error('Sim error', e.message);
    }
  }, 5000);
}

simulateBus('BUS101','101');
simulateBus('BUS102','101');
