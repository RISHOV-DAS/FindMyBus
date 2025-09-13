import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number
});

const routeSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true, unique: true },
  name: String,
  stops: [stopSchema]
});

export default mongoose.model('Route', routeSchema);
