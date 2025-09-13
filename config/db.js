import mongoose from 'mongoose';

export default async function connectDB(){
  const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/bus_tracker';
  try{
    await mongoose.connect(MONGO);
    console.log('MongoDB connected');
  }catch(e){
    console.error('MongoDB connection error', e.message);
    process.exit(1);
  }
}
