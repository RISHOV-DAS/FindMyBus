import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "../models/Route.js";
import Bus from "../models/Bus.js";

dotenv.config();
const MONGO = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO);
  await Route.deleteMany({});
  await Bus.deleteMany({});

  const route = await Route.create({
    routeNumber: "101",
    name: "Route 101",
    stops: [
      { name: "Stop A", lat: 22.5726, lng: 88.3639 },
      { name: "Stop B", lat: 22.58, lng: 88.37 },
      { name: "Stop C", lat: 22.59, lng: 88.38 },
      { name: "Stop D", lat: 22.6, lng: 88.39 },
    ],
  });

  await Bus.insertMany([
    {
      busId: "BUS101",
      routeNumber: "101",
      lat: 22.5726,
      lng: 88.3639,
      isActive: true,
    },
    {
      busId: "BUS102",
      routeNumber: "101",
      lat: 22.58,
      lng: 88.37,
      isActive: true,
    },
  ]);

  console.log("Seed completed");
  process.exit();
}

seed();
