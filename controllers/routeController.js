import Route from '../models/Route.js';

export const getRoutes = async (req,res)=>{
  try{ const routes = await Route.find(); res.json(routes); }catch(e){ res.status(500).json({error:e.message}); }
};

export const getRouteByNumber = async (req,res)=>{
  try{ const { routeNumber } = req.params; const route = await Route.findOne({ routeNumber }); if(!route) return res.status(404).json({error:'Route not found'}); res.json(route);}catch(e){ res.status(500).json({error:e.message}); }
};
