// npx ts-node server.ts
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { SerialPort, ReadlineParser } from "serialport";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React dev server
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Interface for sensor data
interface SensorData {
  sensorId: string;
  distance: number;
  timestamp: number;
  isFull: boolean;
  receivedAt: number;
}

// ⚠️ CHANGE THIS LINE - Set to false when Arduino is connected ⚠️
const FORCE_MOCK_MODE = true;

// Serial port configuration (adjust for your system)
const PORT_NAME = FORCE_MOCK_MODE ? "MOCK" : process.env.SERIAL_PORT || "COM5";

if (PORT_NAME === "MOCK") {
  console.log("🎭 Running in MOCK DATA mode (FORCE_MOCK_MODE = true)");
  console.log("To use real Arduino, change FORCE_MOCK_MODE to false");

  // Demo mode: Send mock data every 3 seconds
  setInterval(() => {
    const mockData: SensorData = {
      sensorId: Math.random() > 0.5 ? "A" : "B",
      distance: Math.floor(Math.random() * 55),
      timestamp: Date.now(),
      isFull: Math.random() > 0.7,
      receivedAt: Date.now(),
    };
    console.log(`🎭 Mock data: ${JSON.stringify(mockData)}`);
    io.emit("sensor-data", mockData);
  }, 3000);
} else {
  try {
    console.log(`🔌 Attempting to connect to serial port: ${PORT_NAME}`);
    const port = new SerialPort({
      path: PORT_NAME,
      baudRate: 9600,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", (data: string) => {
      console.log(`📥 Raw data: ${data}`);

      // Parse the data: Format is "A,distance,time" or "B,distance,time"
      const parts = data.trim().split(",");

      if (parts.length === 3) {
        const [sensorId, distanceStr, timeStr] = parts;
        const distance = parseInt(distanceStr);
        const timestamp = parseInt(timeStr);

        const sensorData: SensorData = {
          sensorId: sensorId,
          distance: distance,
          timestamp: timestamp,
          isFull: distance < 20, // Example: if distance < 20cm, bin is full
          receivedAt: Date.now(),
        };

        console.log(`✅ Parsed: ${JSON.stringify(sensorData)}`);

        // Send to all connected React clients
        io.emit("sensor-data", sensorData);
      }
    });

    port.on("error", (err: Error) => {
      console.error("❌ Serial port error:", err.message);
    });

    port.on("open", () => {
      console.log(`✅ Connected to serial port: ${PORT_NAME}`);
    });
  } catch (error: any) {
    console.error("❌ Failed to open serial port:", error.message);
    console.log("🔄 Switching to mock data mode...");

    // Fallback to mock data if serial fails
    setInterval(() => {
      const mockData: SensorData = {
        sensorId: Math.random() > 0.5 ? "A" : "B",
        distance: Math.floor(Math.random() * 300),
        timestamp: Date.now(),
        isFull: Math.random() > 0.7,
        receivedAt: Date.now(),
      };
      console.log(`🎭 Fallback mock data: ${JSON.stringify(mockData)}`);
      io.emit("sensor-data", mockData);
    }, 3000);
  }
}

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔗 React client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ React client disconnected:", socket.id);
  });
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Sensor data server is running",
    mode: PORT_NAME === "MOCK" ? "mock" : "real",
    port: PORT_NAME === "MOCK" ? "none" : PORT_NAME,
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Sensor Data Backend Server is running!");
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(
    `📊 Mode: ${PORT_NAME === "MOCK" ? "MOCK DATA" : "REAL ARDUINO"}`
  );
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
