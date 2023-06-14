import { WebSocket, WebSocketServer } from "ws";
import server from './app.js';

const wss = new WebSocketServer({ server });

// Function to send data to all connected clients
export default broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');
  // Send a welcome message to the connected client
  ws.send(JSON.stringify({ message: 'Connected to WebSocket server.' }));
});