// // npx ts-node server.ts
// import express, { Request, Response } from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { SerialPort, ReadlineParser } from "serialport";
// import cors from "cors";
// import TelegramBot from "node-telegram-bot-api";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Your React dev server
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors());

// // Interface for sensor data
// interface SensorData {
//   sensorId: string;
//   distance: number;
//   timestamp: number;
//   isFull: boolean;
//   receivedAt: number;
// }

// const TELEGRAM_TOKEN = "8082516160:AAEk4d_Q-BJLLrvb5I0xBNrRDPfAfuSzV3Q"; // from BotFather
// const CHAT_ID = "1167952257";

// const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
// bot
//   .sendMessage(CHAT_ID, "✅ Test message from Node server!")
//   .then(() => console.log("Test message sent successfully"))
//   .catch((err) => console.error("Telegram error:", err));

// function notifyBinFull(sensorId: string, distance: number) {
//   const message = `🚨 Bin ${sensorId} is FULL!\nDistance: ${distance}cm\nPlease clean the bin.`;
//   bot.sendMessage(CHAT_ID, message);
// }

// // ⚠️ CHANGE THIS LINE - Set to false when Arduino is connected ⚠️
// const FORCE_MOCK_MODE = true;

// // Serial port configuration (adjust for your system)
// const PORT_NAME = FORCE_MOCK_MODE ? "MOCK" : process.env.SERIAL_PORT || "COM5";

// if (PORT_NAME === "MOCK") {
//   console.log("🎭 Running in MOCK DATA mode (FORCE_MOCK_MODE = true)");
//   console.log("To use real Arduino, change FORCE_MOCK_MODE to false");

//   // Demo mode: Send mock data every 3 seconds
//   setInterval(() => {
//     const mockData: SensorData = {
//       sensorId: Math.random() > 0.5 ? "A" : "B",
//       distance: Math.floor(Math.random() * 300),
//       timestamp: Date.now(),
//       isFull: Math.random() > 0.7,
//       receivedAt: Date.now(),
//     };

//     console.log(`🎭 Mock data: ${JSON.stringify(mockData)}`);
//     io.emit("sensor-data", mockData);
//     //mock
//     if (mockData.isFull) {
//       console.log(
//         `⚠️ Bin ${mockData.sensorId} is full, sending Telegram alert`
//       );
//       notifyBinFull(mockData.sensorId, mockData.distance);
//     }
//   }, 3000);
// } else {
//   try {
//     console.log(`🔌 Attempting to connect to serial port: ${PORT_NAME}`);
//     const port = new SerialPort({
//       path: PORT_NAME,
//       baudRate: 9600,
//     });

//     const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

//     parser.on("data", (data: string) => {
//       console.log(`📥 Raw data: ${data}`);

//       // Parse the data: Format is "A,distance,time" or "B,distance,time"
//       const parts = data.trim().split(",");

//       if (parts.length === 3) {
//         const [sensorId, distanceStr, timeStr] = parts;
//         const distance = parseInt(distanceStr);
//         const timestamp = parseInt(timeStr);

//         const sensorData: SensorData = {
//           sensorId: sensorId,
//           distance: distance,
//           timestamp: timestamp,
//           isFull: distance < 20, // Example: if distance < 20cm, bin is full
//           receivedAt: Date.now(),
//         };

//         console.log(`✅ Parsed: ${JSON.stringify(sensorData)}`);

//         // Send to all connected React clients
//         io.emit("sensor-data", sensorData);
//         /// Notify via Telegram if bin is full
//         if (sensorData.isFull) {
//           notifyBinFull(sensorData.sensorId, sensorData.distance);
//         }
//       }
//     });

//     port.on("error", (err: Error) => {
//       console.error("❌ Serial port error:", err.message);
//     });

//     port.on("open", () => {
//       console.log(`✅ Connected to serial port: ${PORT_NAME}`);
//     });
//   } catch (error: any) {
//     console.error("❌ Failed to open serial port:", error.message);
//     console.log("🔄 Switching to mock data mode...");

//     // Fallback to mock data if serial fails
//     setInterval(() => {
//       const mockData: SensorData = {
//         sensorId: Math.random() > 0.5 ? "A" : "B",
//         distance: Math.floor(Math.random() * 300),
//         timestamp: Date.now(),
//         isFull: Math.random() > 0.7,
//         receivedAt: Date.now(),
//       };
//       console.log(`🎭 Fallback mock data: ${JSON.stringify(mockData)}`);
//       io.emit("sensor-data", mockData);

//       if (mockData.isFull) {
//         notifyBinFull(mockData.sensorId, mockData.distance);
//       }
//     }, 3000);
//   }
// }

// // Socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("🔗 React client connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ React client disconnected:", socket.id);
//   });
// });

// // Health check endpoint
// app.get("/health", (_req: Request, res: Response) => {
//   res.json({
//     status: "OK",
//     message: "Sensor data server is running",
//     mode: PORT_NAME === "MOCK" ? "mock" : "real",
//     port: PORT_NAME === "MOCK" ? "none" : PORT_NAME,
//   });
// });

// app.get("/", (_req: Request, res: Response) => {
//   res.send("🚀 Sensor Data Backend Server is running!");
// });
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`🚀 Backend server running on http://localhost:${PORT}`);
//   console.log(
//     `📊 Mode: ${PORT_NAME === "MOCK" ? "MOCK DATA" : "REAL ARDUINO"}`
//   );
//   console.log(`🔗 Health check: http://localhost:${PORT}/health`);
// });

// // Handle graceful shutdown
// process.on("SIGINT", () => {
//   console.log("Shutting down server...");
//   server.close(() => {
//     console.log("Server closed");
//     process.exit(0);
//   });
// });

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { SerialPort, ReadlineParser } from "serialport";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";

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

// Telegram Bot Setup
const TELEGRAM_TOKEN = "8082516160:AAEk4d_Q-BJLLrvb5I0xBNrRDPfAfuSzV3Q"; // from BotFather
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// Pre-registered workers with their assignments
const WORKERS = {
  MEAZA: {
    id: "MEAZA-001",
    name: "Meaza Mulatu Tale",
    chatId: "1167952257", // Meaza's Telegram ID
    subcity: "Bole",
    sensor: "A", // Responsible for Sensor A (Solid Waste)
  },
  KIDIST: {
    id: "KIDIST-001",
    name: "Kidist Alemayehu",
    chatId: "649021695", // Kidist's Telegram ID
    subcity: "Kirkos",
    sensor: "B", // Responsible for Sensor B (Liquid Waste)
  },
};

// Send test message to both workers on startup
bot
  .sendMessage(
    WORKERS.MEAZA.chatId,
    "✅ Server started! You are assigned to Bole area (Sensor A - Solid Waste)."
  )
  .then(() =>
    console.log(`📤 Welcome message sent to Meaza (${WORKERS.MEAZA.chatId})`)
  )
  .catch((err) => console.error("Telegram error for Meaza:", err));

bot
  .sendMessage(
    WORKERS.KIDIST.chatId,
    "✅ Server started! You are assigned to Kirkos area (Sensor B - Liquid Waste)."
  )
  .then(() =>
    console.log(`📤 Welcome message sent to Kidist (${WORKERS.KIDIST.chatId})`)
  )
  .catch((err) => console.error("Telegram error for Kidist:", err));

// ========== ONLY ONE ALERT FUNCTION ==========
function notifyBinFull(sensorId: string, distance: number, location: string) {
  let worker;
  let binType;

  if (sensorId === "A") {
    worker = WORKERS.MEAZA;
    binType = "Solid Waste";
  } else if (sensorId === "B") {
    worker = WORKERS.KIDIST;
    binType = "Solid Waste"; // Fixed: Changed from "Solid Waste" to "Liquid Waste"
  } else {
    console.error(`❌ Unknown sensor ID: ${sensorId}`);
    return;
  }

  const message =
    `🚨 *BIN FULL ALERT*\n\n` +
    `👷 *Assigned To:* ${worker.name}\n` +
    `📍 *Location:* ${location}\n` +
    `🗺️ *Area:* ${worker.subcity}\n` +
    `🚮 *Bin Type:* ${binType}\n` +
    `📏 *Distance:* ${distance}cm\n` +
    `🆔 *Sensor:* ${sensorId}\n\n` +
    `⚠️ *Action Required:* Please clean the bin within 2 hours\n\n` +
    `📌 *Google Maps:* https://maps.google.com/?q=${
      getCoordinates(sensorId).lat
    },${getCoordinates(sensorId).lng}\n\n` +
    `✅ Reply: /done_${sensorId} when completed\n` +
    `❌ Reply: /problem_${sensorId} if issue\n\n` +
    `*AASTU Waste Management System*`;

  bot
    .sendMessage(worker.chatId, message, { parse_mode: "Markdown" })
    .then(() => {
      console.log(
        `📤 Alert sent to ${worker.name} (${worker.subcity}) for Sensor ${sensorId}`
      );
    })
    .catch((err) => {
      console.error(`❌ Failed to send alert to ${worker.name}:`, err);
    });
}
// =============================================

// Get coordinates for each sensor location
function getCoordinates(sensorId: string): { lat: number; lng: number } {
  if (sensorId === "A") {
    return { lat: 8.9958, lng: 38.7856 }; // Bole
  } else {
    return { lat: 8.9967, lng: 38.7969 }; // Kirkos
  }
}

// Get location name for each sensor
function getLocation(sensorId: string): string {
  if (sensorId === "A") {
    return "Bole Road, Near Airport (Solid Waste Bin)";
  } else {
    return "Megenagna, Main Junction (Liquid Waste Bin)";
  }
}

// Get subcity for each sensor
function getSubcity(sensorId: string): string {
  if (sensorId === "A") {
    return "Bole";
  } else {
    return "Kirkos";
  }
}

// Track last alert time to avoid spam
const lastAlertTime: { [key: string]: number } = {};
const ALERT_COOLDOWN = 0.5 * 60 * 1000; // 5 minutes cooldown

// Function to check if we should send an alert
function shouldSendAlert(sensorId: string, distance: number): boolean {
  const now = Date.now();
  const lastTime = lastAlertTime[sensorId] || 0;

  // Send alert if:
  // 1. Distance is less than 20cm (bin is full)
  // 2. AND cooldown period has passed
  if (distance < 20 && now - lastTime > ALERT_COOLDOWN) {
    lastAlertTime[sensorId] = now;
    return true;
  }

  return false;
}

// ⚠️ CHANGE THIS LINE - Set to false when Arduino is connected ⚠️
const FORCE_MOCK_MODE = true;

// Serial port configuration (adjust for your system)
const PORT_NAME = FORCE_MOCK_MODE ? "MOCK" : process.env.SERIAL_PORT || "COM5";

if (PORT_NAME === "MOCK") {
  console.log("🎭 Running in MOCK DATA mode (FORCE_MOCK_MODE = true)");
  console.log("To use real Arduino, change FORCE_MOCK_MODE to false");
  console.log("\n👷 Worker Assignments:");
  console.log(`  • Meaza (${WORKERS.MEAZA.chatId}) → Bole → Sensor A`);
  console.log(`  • Kidist (${WORKERS.KIDIST.chatId}) → Kirkos → Sensor B`);

  // Demo mode: Send mock data every 3 seconds
  setInterval(() => {
    const sensorId = Math.random() > 0.5 ? "A" : "B";
    const isCritical = Math.random() < 0.2; // 20% chance of critical
    const distance = isCritical
      ? Math.floor(Math.random() * 20) // Critical: 0-20cm
      : Math.floor(Math.random() * 55); // Normal: 0-55cm

    const mockData: SensorData = {
      sensorId: sensorId,
      distance: distance,
      timestamp: Date.now(),
      isFull: distance < 20,
      receivedAt: Date.now(),
    };

    console.log(`🎭 Mock data: ${JSON.stringify(mockData)}`);
    io.emit("sensor-data", mockData);

    // Send alert if bin is full and cooldown passed
    if (shouldSendAlert(sensorId, distance)) {
      console.log(
        `🚨 CRITICAL: Sensor ${sensorId} (${distance}cm) - Sending to ${
          sensorId === "A" ? "Meaza" : "Kidist"
        }`
      );
      notifyBinFull(sensorId, distance, getLocation(sensorId));
    }
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
          isFull: distance < 8,
          receivedAt: Date.now(),
        };

        console.log(`✅ Parsed: ${JSON.stringify(sensorData)}`);

        // Send to all connected React clients
        io.emit("sensor-data", sensorData);

        // Send alert if bin is full and cooldown passed
        if (shouldSendAlert(sensorId, distance)) {
          console.log(
            `🚨 CRITICAL: Sensor ${sensorId} (${distance}cm) - Sending to ${
              sensorId === "A" ? "Meaza" : "Kidist"
            }`
          );
          notifyBinFull(sensorId, distance, getLocation(sensorId));
        }
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
      const sensorId = Math.random() > 0.5 ? "A" : "B";
      const isCritical = Math.random() < 0.2;
      const distance = isCritical
        ? Math.floor(Math.random() * 20)
        : Math.floor(Math.random() * 55);

      const mockData: SensorData = {
        sensorId: sensorId,
        distance: distance,
        timestamp: Date.now(),
        isFull: distance < 20,
        receivedAt: Date.now(),
      };

      console.log(`🎭 Fallback mock data: ${JSON.stringify(mockData)}`);
      io.emit("sensor-data", mockData);

      if (shouldSendAlert(sensorId, distance)) {
        console.log(
          `🚨 CRITICAL: Sensor ${sensorId} (${distance}cm) - Sending to ${
            sensorId === "A" ? "Meaza" : "Kidist"
          }`
        );
        notifyBinFull(sensorId, distance, getLocation(sensorId));
      }
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
    workers: [
      {
        name: WORKERS.MEAZA.name,
        assigned: WORKERS.MEAZA.subcity,
        sensor: WORKERS.MEAZA.sensor,
        status: "active",
      },
      {
        name: WORKERS.KIDIST.name,
        assigned: WORKERS.KIDIST.subcity,
        sensor: WORKERS.KIDIST.sensor,
        status: "active",
      },
    ],
  });
});

// Test alert endpoints
app.get("/test-alert-meaza", (_req: Request, res: Response) => {
  notifyBinFull("A", 15, getLocation("A"));
  res.json({
    success: true,
    message: "Test alert sent to Meaza",
    worker: WORKERS.MEAZA.name,
    subcity: WORKERS.MEAZA.subcity,
    sensor: "A",
  });
});

app.get("/test-alert-kidist", (_req: Request, res: Response) => {
  notifyBinFull("B", 18, getLocation("B"));
  res.json({
    success: true,
    message: "Test alert sent to Kidist",
    worker: WORKERS.KIDIST.name,
    subcity: WORKERS.KIDIST.subcity,
    sensor: "B",
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Waste Management Server</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { background: #e8f5e8; padding: 15px; border-radius: 5px; }
        .workers { margin-top: 20px; }
        .worker-card { 
          background: white; 
          padding: 15px; 
          margin: 10px 0; 
          border-left: 4px solid #4CAF50;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .endpoints { margin-top: 20px; }
        .endpoint { 
          background: #f0f0f0; 
          padding: 10px; 
          margin: 5px 0; 
          border-left: 4px solid #2196F3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 AASTU Waste Management Server</h1>
        
        <div class="status">
          <p><strong>Status:</strong> Running</p>
          <p><strong>Mode:</strong> ${
            PORT_NAME === "MOCK" ? "MOCK DATA" : "REAL ARDUINO"
          }</p>
          <p><strong>Telegram Alerts:</strong> Active</p>
        </div>
        
        <div class="workers">
          <h3>👷 Worker Assignments:</h3>
          <div class="worker-card">
            <h4>${WORKERS.MEAZA.name}</h4>
            <p><strong>ID:</strong> ${WORKERS.MEAZA.id}</p>
            <p><strong>Area:</strong> ${WORKERS.MEAZA.subcity}</p>
            <p><strong>Sensor:</strong> ${
              WORKERS.MEAZA.sensor
            } (Solid Waste)</p>
            <p><strong>Telegram ID:</strong> ${WORKERS.MEAZA.chatId}</p>
          </div>
          <div class="worker-card">
            <h4>${WORKERS.KIDIST.name}</h4>
            <p><strong>ID:</strong> ${WORKERS.KIDIST.id}</p>
            <p><strong>Area:</strong> ${WORKERS.KIDIST.subcity}</p>
            <p><strong>Sensor:</strong> ${
              WORKERS.KIDIST.sensor
            } (Liquid Waste)</p>
            <p><strong>Telegram ID:</strong> ${WORKERS.KIDIST.chatId}</p>
          </div>
        </div>
        
        <div class="endpoints">
          <h3>🔗 API Endpoints:</h3>
          <div class="endpoint"><strong>GET /health</strong> - Server status</div>
          <div class="endpoint"><strong>GET /test-alert-meaza</strong> - Send test alert to Meaza (Sensor A)</div>
          <div class="endpoint"><strong>GET /test-alert-kidist</strong> - Send test alert to Kidist (Sensor B)</div>
          <div class="endpoint"><strong>WebSocket</strong> - Real-time data at ws://localhost:${PORT}</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(
    `📊 Mode: ${PORT_NAME === "MOCK" ? "MOCK DATA" : "REAL ARDUINO"}`
  );
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Test Meaza alert: http://localhost:${PORT}/test-alert-meaza`);
  console.log(
    `📱 Test Kidist alert: http://localhost:${PORT}/test-alert-kidist`
  );
  console.log(`\n🛑 Press Ctrl+C to stop the server\n`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");

  // Send shutdown notification to workers
  bot
    .sendMessage(
      WORKERS.MEAZA.chatId,
      "🛑 Server is shutting down. Alerts will resume when server restarts."
    )
    .catch((err) => console.error("Failed to notify Meaza:", err));

  bot
    .sendMessage(
      WORKERS.KIDIST.chatId,
      "🛑 Server is shutting down. Alerts will resume when server restarts."
    )
    .catch((err) => console.error("Failed to notify Kidist:", err));

  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
