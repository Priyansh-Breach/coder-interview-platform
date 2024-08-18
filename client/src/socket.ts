import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to WebSocket server");

  // Example of emitting an event to the server
  socket.emit("exampleEvent", { message: "Hello from the client!" });

  // Example of listening to a response event from the server
  socket.on("responseEvent", (data) => {
    console.log("Received from server:", data);
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;
