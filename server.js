import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import busRoutes from "./routes/bus.js";
import routeRoutes from "./routes/route.js";

dotenv.config();
await connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/buses", busRoutes);
app.use("/api/route", routeRoutes);

io.on("connection", (socket) => {
  console.log("WS client connected", socket.id);
  socket.on("subscribeBus", (busId) => socket.join(`bus:${busId}`));
  socket.on("subscribeRoute", (routeNumber) =>
    socket.join(`route:${routeNumber}`)
  );
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
