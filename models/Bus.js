import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  routeNumber: { type: String, required: true },
  stopName: { type: String, default: null },
  nextStopName: { type: String, default: null },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Bus", busSchema);
