// npx ts-node server.ts

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { SerialPort, ReadlineParser } from "serialport";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import { Pool, QueryResult } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


let mockInterval: NodeJS.Timeout | null = null;
let fallbackInterval: NodeJS.Timeout | null = null;


dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "waste_management",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgresql",
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database");
    release();
  }
});

// Interface for sensor data
interface SensorData {
  sensorId: string;
  distance: number;
  timestamp: number;
  isFull: boolean;
  receivedAt: number;
}

// Telegram Bot Setup
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "8082516160:AAEk4d_Q-BJLLrvb5I0xBNrRDPfAfuSzV3Q";
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this-in-production";

// Subcities data
const SUBCITIES = [
  { en: "Addis Ketema", am: "አዲስ ከተማ" },
  { en: "Akaky Kaliti", am: "አካኪ ቃሊቲ" },
  { en: "Arada", am: "አራዳ" },
  { en: "Bole", am: "ቦሌ" },
  { en: "Gullele", am: "ጉለሌ" },
  { en: "Kirkos", am: "ቂርቆስ" },
  { en: "Kolfe Keranio", am: "ቆልፌ ቀራንዮ" },
  { en: "Lideta", am: "ልደታ" },
  { en: "Nifas Silk-Lafto", am: "ንፋስ ስልክ ላፍቶ" },
  { en: "Yeka", am: "የካ" },
];

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    (req as any).user = user;
    next();
  });
};

// Track last alert time to avoid spam
const lastAlertTime: { [key: string]: number } = {};
const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown



// Create tables if they don't exist
async function initializeDatabase() {
  try {
    // Create employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        telegram_chat_id VARCHAR(50) UNIQUE NOT NULL,
        assigned_subcity VARCHAR(100) NOT NULL,
        assigned_sensor VARCHAR(10) NOT NULL,
        phone_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bin_locations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bin_locations (
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(10) UNIQUE NOT NULL,
        subcity VARCHAR(100) NOT NULL,
        location_name VARCHAR(200) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        bin_type VARCHAR(50) NOT NULL,
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cleaning_records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cleaning_records (
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(10) NOT NULL,
        employee_id INTEGER REFERENCES employees(id),
        cleaned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        previous_status VARCHAR(50),
        notes TEXT
      )
    `);

    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        full_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sensor_data_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_data_history (
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(10) NOT NULL,
        distance DECIMAL(5, 2) NOT NULL,
        is_full BOOLEAN NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

// Call initialization of the database
initializeDatabase();


async function notifyBinFull(sensorId: string, distance: number) {
  try {
    // Get bin location details
    const binResult = await pool.query(
      `SELECT * FROM bin_locations WHERE sensor_id = $1`,
      [sensorId]
    );

    if (binResult.rows.length === 0) {
      console.error(`❌ No bin location found for sensor ${sensorId}`);
      return;
    }

    const bin = binResult.rows[0];

    // Get assigned employee
    const employeeResult = await pool.query(
      `SELECT * FROM employees WHERE assigned_sensor = $1`,
      [sensorId]
    );

    if (employeeResult.rows.length === 0) {
      console.error(`❌ No employee assigned to sensor ${sensorId}`);
      return;
    }

    const employee = employeeResult.rows[0];

    const message =
      `🚨 *BIN FULL ALERT*\n\n` +
      `👷 *Assigned To:* ${employee.name}\n` +
      `📍 *Location:* ${bin.location_name}\n` +
      `🗺️ *Area:* ${bin.subcity}\n` +
      `🚮 *Bin Type:* ${bin.bin_type}\n` +
      `📏 *Distance:* ${distance}cm\n` +
      `🆔 *Sensor:* ${sensorId}\n\n` +
      `⚠️ *Action Required:* Please clean the bin within 2 hours\n\n` +
      `📌 *Google Maps:* https://maps.google.com/?q=${bin.latitude},${bin.longitude}\n\n` +
      `✅ Reply: /done_${sensorId} when completed\n` +
      `❌ Reply: /problem_${sensorId} if issue\n\n` +
      `*AASTU Waste Management System*`;

    bot
      .sendMessage(employee.telegram_chat_id, message, { parse_mode: "Markdown" })
      .then(() => {
        console.log(
          `📤 Alert sent to ${employee.name} (${employee.assigned_subcity}) for Sensor ${sensorId}`
        );
      })
      .catch((err) => {
        console.error(`❌ Failed to send alert to ${employee.name}:`, err);
      });
  } catch (error) {
    console.error("❌ Error in notifyBinFull:", error);
  }
}

// End point 
// Admin Login
app.post("/api/admin/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Create admin (for initial setup)
app.post("/api/admin/create", async (req: Request, res: Response) => {
  try {
    const { username, password, email, full_name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO admins (username, password_hash, email, full_name) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name`,
      [username, hashedPassword, email, full_name]
    );

    res.json({
      success: true,
      message: "Admin created successfully",
      admin: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create admin error:", error);
    if (error.code === "23505") {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// 3. Add employee
app.post("/api/employees", authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      employee_id,
      name,
      telegram_chat_id,
      assigned_subcity,
      assigned_sensor,
      phone_number,
    } = req.body;

    if (!employee_id || !name || !telegram_chat_id || !assigned_subcity || !assigned_sensor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if sensor is already assigned
    const existingSensor = await pool.query(
      "SELECT * FROM employees WHERE assigned_sensor = $1",
      [assigned_sensor]
    );

    if (existingSensor.rows.length > 0) {
      return res.status(400).json({
        error: `Sensor ${assigned_sensor} is already assigned to ${existingSensor.rows[0].name}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO employees 
       (employee_id, name, telegram_chat_id, assigned_subcity, assigned_sensor, phone_number) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [employee_id, name, telegram_chat_id, assigned_subcity, assigned_sensor, phone_number]
    );

    // Send welcome message to employee
    bot.sendMessage(
      telegram_chat_id,
      `👋 Welcome to AASTU Waste Management System!\n\n` +
      `📋 Your Assignment:\n` +
      `• Name: ${name}\n` +
      `• Employee ID: ${employee_id}\n` +
      `• Area: ${assigned_subcity}\n` +
      `• Sensor: ${assigned_sensor}\n\n` +
      `You will receive alerts when your assigned bin needs cleaning.`
    ).catch(err => console.error("Failed to send welcome message:", err));

    res.json({
      success: true,
      message: "Employee added successfully",
      employee: result.rows[0],
    });
  } catch (error: any) {
    console.error("Add employee error:", error);
    if (error.code === "23505") {
      res.status(400).json({ error: "Employee ID or Telegram ID already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// 4. Get all employees
app.get("/api/employees", authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY created_at DESC"
    );
    res.json({ success: true, employees: result.rows });
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Update employee
app.put("/api/employees/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      telegram_chat_id,
      assigned_subcity,
      assigned_sensor,
      phone_number,
    } = req.body;

    const result = await pool.query(
      `UPDATE employees 
       SET name = $1, telegram_chat_id = $2, assigned_subcity = $3, 
           assigned_sensor = $4, phone_number = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`,
      [name, telegram_chat_id, assigned_subcity, assigned_sensor, phone_number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update employee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Delete employee
app.delete("/api/employees/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 7. Add bin location
app.post("/api/bin-locations", authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      sensor_id,
      subcity,
      location_name,
      latitude,
      longitude,
      bin_type,
      address,
    } = req.body;

    if (!sensor_id || !subcity || !location_name || !latitude || !longitude || !bin_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO bin_locations 
       (sensor_id, subcity, location_name, latitude, longitude, bin_type, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [sensor_id, subcity, location_name, latitude, longitude, bin_type, address]
    );

    res.json({
      success: true,
      message: "Bin location added successfully",
      location: result.rows[0],
    });
  } catch (error: any) {
    console.error("Add bin location error:", error);
    if (error.code === "23505") {
      res.status(400).json({ error: "Sensor ID already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// 8. Get all bin locations
app.get("/api/bin-locations", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bin_locations ORDER BY subcity, sensor_id"
    );
    res.json({ success: true, locations: result.rows });
  } catch (error) {
    console.error("Get bin locations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 9. Update bin location
app.put("/api/bin-locations/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      sensor_id,
      subcity,
      location_name,
      latitude,
      longitude,
      bin_type,
      address,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE bin_locations 
       SET sensor_id = $1, subcity = $2, location_name = $3, latitude = $4, 
           longitude = $5, bin_type = $6, address = $7, is_active = $8
       WHERE id = $9
       RETURNING *`,
      [sensor_id, subcity, location_name, latitude, longitude, bin_type, address, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bin location not found" });
    }

    res.json({
      success: true,
      message: "Bin location updated successfully",
      location: result.rows[0],
    });
  } catch (error) {
    console.error("Update bin location error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// 10. Record cleaning
app.post("/api/cleaning-records", async (req: Request, res: Response) => {
  try {
    const { sensor_id, employee_id, previous_status, notes } = req.body;

    if (!sensor_id) {
      return res.status(400).json({ error: "Sensor ID is required" });
    }

    // Validate sensor exists in bin_locations
    const sensorCheck = await pool.query(
      "SELECT id FROM bin_locations WHERE sensor_id = $1",
      [sensor_id]
    );

    if (sensorCheck.rows.length === 0) {
      return res.status(400).json({ 
        error: `Sensor ${sensor_id} not found in bin locations` 
      });
    }

    // Validate employee exists if provided
    if (employee_id) {
      const employeeCheck = await pool.query(
        "SELECT id FROM employees WHERE id = $1",
        [employee_id]
      );

      if (employeeCheck.rows.length === 0) {
        return res.status(400).json({ 
          error: `Employee with ID ${employee_id} not found` 
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO cleaning_records 
       (sensor_id, employee_id, previous_status, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sensor_id, employee_id, previous_status, notes]
    );

    res.json({
      success: true,
      message: "Cleaning recorded successfully",
      record: result.rows[0],
    });
  } catch (error: any) {
    console.error("❌ Record cleaning error:", error.message, error.stack);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// 11. Get last cleaning time for all bins
app.get("/api/cleaning-history", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        bl.sensor_id,
        bl.location_name,
        bl.subcity,
        bl.bin_type,
        cr.cleaned_at,
        cr.previous_status,
        cr.notes,
        e.name as cleaned_by
      FROM bin_locations bl
      LEFT JOIN LATERAL (
        SELECT * FROM cleaning_records 
        WHERE sensor_id = bl.sensor_id 
        ORDER BY cleaned_at DESC 
        LIMIT 1
      ) cr ON true
      LEFT JOIN employees e ON cr.employee_id = e.id
      ORDER BY bl.sensor_id
    `);

    res.json({ success: true, history: result.rows });
  } catch (error) {
    console.error("Get cleaning history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 12. Get subcities list (with both English and Amharic)
app.get("/api/subcities", async (req: Request, res: Response) => {
  res.json({ success: true, subcities: SUBCITIES });
});

// 13. Get dashboard statistics
app.get("/api/dashboard/stats", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get total bins
    const binsResult = await pool.query(
      "SELECT COUNT(*) as total_bins, COUNT(CASE WHEN is_active THEN 1 END) as active_bins FROM bin_locations"
    );

    // Get total employees
    const employeesResult = await pool.query("SELECT COUNT(*) as total_employees FROM employees");

    // Get today's alerts (assuming full bins)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alertsResult = await pool.query(
      "SELECT COUNT(*) as today_alerts FROM sensor_data_history WHERE is_full = true AND recorded_at >= $1",
      [today]
    );

    // Get pending cleanings (bins that were full in last 24 hours but not cleaned)
    const pendingResult = await pool.query(`
      SELECT COUNT(DISTINCT sensor_id) as pending_cleanings
      FROM sensor_data_history sd
      WHERE sd.is_full = true 
        AND sd.recorded_at >= NOW() - INTERVAL '24 hours'
        AND NOT EXISTS (
          SELECT 1 FROM cleaning_records cr 
          WHERE cr.sensor_id = sd.sensor_id 
            AND cr.cleaned_at >= sd.recorded_at
        )
    `);

    res.json({
      success: true,
      stats: {
        totalBins: parseInt(binsResult.rows[0].total_bins),
        activeBins: parseInt(binsResult.rows[0].active_bins),
        totalEmployees: parseInt(employeesResult.rows[0].total_employees),
        todayAlerts: parseInt(alertsResult.rows[0].today_alerts),
        pendingCleanings: parseInt(pendingResult.rows[0].pending_cleanings || 0),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// SENSOR DATA PROCESSING 

// Function to check if we should send an alert
function shouldSendAlert(sensorId: string, distance: number): boolean {
  const now = Date.now();
  const lastTime = lastAlertTime[sensorId] || 0;

  if (distance < 20 && now - lastTime > ALERT_COOLDOWN) {
    lastAlertTime[sensorId] = now;
    return true;
  }

  return false;
}

// Function to process sensor data and save to history
async function processSensorData(sensorData: SensorData) {
  try {
    // Save to history
    await pool.query(
      `INSERT INTO sensor_data_history (sensor_id, distance, is_full)
       VALUES ($1, $2, $3)`,
      [sensorData.sensorId, sensorData.distance, sensorData.isFull]
    );

    // Check if bin was full and is now empty (cleaned)
    if (sensorData.distance > 40) { // Assuming > 40cm means bin is empty/safe
      // Check if there was a recent full status
      const recentFullResult = await pool.query(`
        SELECT 1 FROM sensor_data_history 
        WHERE sensor_id = $1 
          AND is_full = true 
          AND recorded_at >= NOW() - INTERVAL '30 minutes'
        LIMIT 1
      `, [sensorData.sensorId]);

      if (recentFullResult.rows.length > 0) {
        // Bin was recently full and is now empty - record automatic cleaning
        await pool.query(
          `INSERT INTO cleaning_records (sensor_id, previous_status, notes)
           VALUES ($1, 'full', 'Automatically detected cleaning based on sensor data')`,
          [sensorData.sensorId]
        );
        console.log(`✅ Auto-recorded cleaning for sensor ${sensorData.sensorId}`);
      }
    }
  } catch (error) {
    console.error("❌ Error processing sensor data:", error);
  }
}

// ⚠️ CHANGE THIS LINE - Set to false when Arduino is connected ⚠️
// const FORCE_MOCK_MODE = process.env.FORCE_MOCK_MODE === "false" || false;
// This handles various truthy/falsy values
const FORCE_MOCK_MODE = (process.env.FORCE_MOCK_MODE || "true").toLowerCase() === "false";

// Serial port configuration
const PORT_NAME = FORCE_MOCK_MODE ? "MOCK" : process.env.SERIAL_PORT || "COM5";

if (PORT_NAME === "MOCK") {
  console.log("🎭 Running in MOCK DATA mode (FORCE_MOCK_MODE = true)");
  console.log("To use real Arduino, change FORCE_MOCK_MODE to false");

  // Demo mode: Send mock data every 3 seconds
  mockInterval = setInterval(async () => {
    const sensorId = Math.random() > 0.5 ? "A" : "B";
    const isCritical = Math.random() < 0.2; // 20% chance of critical
    const distance = isCritical
      ? Math.floor(Math.random() * 20) // Critical: 0-20cm
      : Math.floor(Math.random() * 55); // Normal: 0-300cm

    const mockData: SensorData = {
      sensorId: sensorId,
      distance: distance,
      timestamp: Date.now(),
      isFull: distance < 20,
      receivedAt: Date.now(),
    };

    console.log(`🎭 Mock data: ${JSON.stringify(mockData)}`);
    io.emit("sensor-data", mockData);

    // Process and save sensor data
    await processSensorData(mockData);

    // Send alert if bin is full and cooldown passed
    if (shouldSendAlert(sensorId, distance)) {
      console.log(`🚨 CRITICAL: Sensor ${sensorId} (${distance}cm)`);
      await notifyBinFull(sensorId, distance);
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

    parser.on("data", async (data: string) => {
      console.log(`📥 Raw data: ${data}`);

      const parts = data.trim().split(",");

      if (parts.length === 3) {
        const [sensorId, distanceStr, timeStr] = parts;
        const distance = parseInt(distanceStr);
        const timestamp = parseInt(timeStr);

        const sensorData: SensorData = {
          sensorId: sensorId,
          distance: distance,
          timestamp: timestamp,
          isFull: distance < 20,
          receivedAt: Date.now(),
        };

        console.log(`✅ Parsed: ${JSON.stringify(sensorData)}`);

        // Send to all connected React clients
        io.emit("sensor-data", sensorData);

        // Process and save sensor data
        await processSensorData(sensorData);

        // Send alert if bin is full and cooldown passed
        if (shouldSendAlert(sensorId, distance)) {
          console.log(`🚨 CRITICAL: Sensor ${sensorId} (${distance}cm)`);
          await notifyBinFull(sensorId, distance);
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
    fallbackInterval = setInterval(async () => {
      const sensorId = Math.random() > 0.5 ? "A" : "B";
      const isCritical = Math.random() < 0.2;
      const distance = isCritical
        ? Math.floor(Math.random() * 20)
        : Math.floor(Math.random() * 300);

      const mockData: SensorData = {
        sensorId: sensorId,
        distance: distance,
        timestamp: Date.now(),
        isFull: distance < 20,
        receivedAt: Date.now(),
      };

      console.log(`🎭 Fallback mock data: ${JSON.stringify(mockData)}`);
      io.emit("sensor-data", mockData);

      // Process and save sensor data
      await processSensorData(mockData);

      if (shouldSendAlert(sensorId, distance)) {
        console.log(`🚨 CRITICAL: Sensor ${sensorId} (${distance}cm)`);
        await notifyBinFull(sensorId, distance);
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
    database: "Connected",
    version: "2.0.0",
  });
});

// Root endpoint


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Mode: ${PORT_NAME === "MOCK" ? "MOCK DATA" : "REAL ARDUINO"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Admin API: http://localhost:${PORT}/api/admin/login`);
});

// Handle graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("\n🛑 Shutting down server...");

//   // Close database connection
//   await pool.end();

//   server.close(() => {
//     console.log("✅ Server closed");
//     process.exit(0);
//   });
// });



process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server gracefully...");

  // 🛑 Stop mock intervals FIRST
  if (mockInterval) {
    clearInterval(mockInterval);
    console.log("🧹 Mock interval cleared");
  }

  if (fallbackInterval) {
    clearInterval(fallbackInterval);
    console.log("🧹 Fallback interval cleared");
  }

  // 🛑 Close socket.io
  io.close();

  // 🛑 Close HTTP server
  server.close(async () => {
    console.log("✅ HTTP server closed");

    // 🛑 Close DB LAST
    await pool.end();
    console.log("✅ Database pool closed");

    process.exit(0);
  });
});
