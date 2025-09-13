import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // subscribe to a bus
  socket.emit("subscribeBus", "BUS101");
  socket.emit("subscribeBus", "BUS102");
  socket.emit("subscribeRoute", "101");
  // listen for updates
 socket.on("bus:update", (data) => {
    console.log("📩 Bus update:", data);
  });
  socket.on("route:update", (data) => {
    console.log("📩 Route update:", data);
  });
});
