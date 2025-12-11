// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// // Define the structure of sensor data from Arduino
// interface SensorData {
//   sensorId: string; // 'A' or 'B'
//   distance: number; // Distance in cm
//   timestamp: number; // Arduino timestamp
//   isFull: boolean; // Based on distance threshold
//   receivedAt: number; // When data was received by backend
// }

// // Convert sensor data to BinData format
// interface BinData {
//   id: string;
//   subcity: string;
//   subcityAm: string;
//   location: string;
//   locationAm: string;
//   fillLevel: number;
//   lastCleaned: string;
//   status: "critical" | "warning" | "safe";
//   coordinates: { lat: number; lng: number };
// }

// interface SensorContextType {
//   isConnected: boolean;
//   sensorData: SensorData[];
//   arduinoBins: BinData[];
//   latestSensorA: SensorData | null;
//   latestSensorB: SensorData | null;
// }

// const SensorContext = createContext<SensorContextType>({
//   isConnected: false,
//   sensorData: [],
//   arduinoBins: [],
//   latestSensorA: null,
//   latestSensorB: null,
// });

// export const useSensorData = () => useContext(SensorContext);

// export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [sensorData, setSensorData] = useState<SensorData[]>([]);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [latestSensorA, setLatestSensorA] = useState<SensorData | null>(null);
//   const [latestSensorB, setLatestSensorB] = useState<SensorData | null>(null);
//   const [arduinoBins, setArduinoBins] = useState<BinData[]>([]);

//   useEffect(() => {
//     // Connect to WebSocket server
//     const newSocket = io("http://localhost:3001");
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("✅ Connected to sensor backend");
//       setIsConnected(true);
//     });

//     newSocket.on("sensor-data", (data: SensorData) => {
//       console.log("📡 Received sensor data:", data);

//       // Update sensor data array (keep last 50 readings)
//       setSensorData((prev) => {
//         const newData = [...prev, data];
//         return newData.slice(-50);
//       });

//       // Update latest sensor readings
//       if (data.sensorId === "A") {
//         setLatestSensorA(data);
//       } else if (data.sensorId === "B") {
//         setLatestSensorB(data);
//       }

//       // Convert to BinData format for your existing UI
//       updateArduinoBins(data);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("❌ Disconnected from sensor backend");
//       setIsConnected(false);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // Convert Arduino sensor data to BinData format
//   const updateArduinoBins = (sensorData: SensorData) => {
//     // Map sensor A and B to specific bins in your mock data
//     // You can customize this mapping based on your actual setup
//     const binMap: Record<string, Partial<BinData>> = {
//       A: {
//         id: "ARDUINO-A",
//         subcity: "Bole",
//         subcityAm: "ቦሌ",
//         location: "Sensor A - Solid Waste Bin",
//         locationAm: "ሴንሰር ኤ - ጠንካራ ቆሻሻ መጣሪያ",
//         coordinates: { lat: 8.9958, lng: 38.7856 },
//       },
//       B: {
//         id: "ARDUINO-B",
//         subcity: "Kirkos",
//         subcityAm: "ቂርቆስ",
//         location: "Sensor B - Liquid Waste Bin",
//         locationAm: "ሴንሰር ቢ - ፈሳሽ ቆሻሻ መጣሪያ",
//         coordinates: { lat: 8.9967, lng: 38.7969 },
//       },
//     };

//     const binInfo = binMap[sensorData.sensorId];
//     if (!binInfo) return;

//     // Convert distance to fill level (0-300cm becomes 0-100%)
//     const maxDistance = 300; // Maximum distance Arduino can measure
//     const fillLevel = Math.max(
//       0,
//       100 - Math.round((sensorData.distance / maxDistance) * 100)
//     );

//     // Determine status based on fill level
//     let status: "critical" | "warning" | "safe" = "safe";
//     if (fillLevel >= 90) status = "critical";
//     else if (fillLevel >= 70) status = "warning";

//     const binData: BinData = {
//       id: binInfo.id!,
//       subcity: binInfo.subcity!,
//       subcityAm: binInfo.subcityAm!,
//       location: binInfo.location!,
//       locationAm: binInfo.locationAm!,
//       fillLevel,
//       lastCleaned: new Date().toISOString(), // Update timestamp
//       status,
//       coordinates: binInfo.coordinates!,
//     };

//     setArduinoBins((prev) => {
//       // Update or add the bin
//       const index = prev.findIndex((b) => b.id === binData.id);
//       if (index >= 0) {
//         const updated = [...prev];
//         updated[index] = binData;
//         return updated;
//       } else {
//         return [...prev, binData].slice(-10); // Keep last 10 readings
//       }
//     });
//   };

//   return (
//     <SensorContext.Provider
//       value={{
//         isConnected,
//         sensorData,
//         arduinoBins,
//         latestSensorA,
//         latestSensorB,
//       }}
//     >
//       {children}
//     </SensorContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the structure of sensor data from Arduino
interface SensorData {
  sensorId: string; // 'A' or 'B'
  distance: number; // Distance in cm
  timestamp: number; // Arduino timestamp
  isFull: boolean; // Based on distance threshold
  receivedAt: number; // When data was received by backend
}

// BinData interface from your mock data
interface BinData {
  id: string;
  subcity: string;
  subcityAm: string;
  location: string;
  locationAm: string;
  fillLevel: number;
  lastCleaned: string;
  status: "critical" | "warning" | "safe";
  coordinates: { lat: number; lng: number };
}

interface SensorContextType {
  isConnected: boolean;
  arduinoBins: BinData[];
  latestSensorA: SensorData | null;
  latestSensorB: SensorData | null;
}

const SensorContext = createContext<SensorContextType>({
  isConnected: false,
  arduinoBins: [],
  latestSensorA: null,
  latestSensorB: null,
});

export const useSensorData = () => useContext(SensorContext);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [latestSensorA, setLatestSensorA] = useState<SensorData | null>(null);
  const [latestSensorB, setLatestSensorB] = useState<SensorData | null>(null);
  const [arduinoBins, setArduinoBins] = useState<BinData[]>([]);

  // Map sensor IDs to specific bins
  const sensorBinMap = {
    A: {
      id: "BIN-ARDUINO-A",
      subcity: "Bole",
      subcityAm: "ቦሌ",
      location: "Sensor A - Solid Waste Bin (Arduino)",
      locationAm: "ሴንሰር ኤ - ጠንካራ ቆሻሻ መጣሪያ (አርዱይኖ)",
      coordinates: { lat: 8.9958, lng: 38.7856 },
    },
    B: {
      id: "BIN-ARDUINO-B",
      subcity: "Kirkos",
      subcityAm: "ቂርቆስ",
      location: "Sensor B - Solid Waste Bin (Arduino)",
      locationAm: "ሴንሰር ቢ - ጠንካራ ቆሻሻ መጣሪያ (አርዱይኖ)",
      coordinates: { lat: 8.9967, lng: 38.7969 },
    },
  };

  // Convert distance to fill level (0-300cm becomes 0-100%)
  const distanceToFillLevel = (distance: number): number => {
    const maxDistance = 55; // Maximum distance Arduino can measure
    // If distance is 0cm, bin is 100% full
    // If distance is 55cm, bin is 0% full
    const fillLevel = Math.max(
      0,
      100 - Math.round((distance / maxDistance) * 100)
    );
    return Math.min(100, fillLevel); // Cap at 100%
  };

  // Determine status based on fill level
  const getStatus = (fillLevel: number): "critical" | "warning" | "safe" => {
    if (fillLevel >= 90) return "critical";
    if (fillLevel >= 70) return "warning";
    return "safe";
  };

  // Convert Arduino sensor data to BinData format
  const convertToBinData = (sensorData: SensorData): BinData | null => {
    const binInfo =
      sensorBinMap[sensorData.sensorId as keyof typeof sensorBinMap];
    if (!binInfo) return null;

    const fillLevel = distanceToFillLevel(sensorData.distance);
    const status = getStatus(fillLevel);

    return {
      id: binInfo.id,
      subcity: binInfo.subcity,
      subcityAm: binInfo.subcityAm,
      location: binInfo.location,
      locationAm: binInfo.locationAm,
      fillLevel,
      lastCleaned: new Date().toISOString(), // Update with current time
      status,
      coordinates: binInfo.coordinates,
    };
  };

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to sensor backend");
      setIsConnected(true);
    });

    newSocket.on("sensor-data", (data: SensorData) => {
      console.log("📡 Received sensor data:", data);

      // Update latest sensor readings
      if (data.sensorId === "A") {
        setLatestSensorA(data);
      } else if (data.sensorId === "B") {
        setLatestSensorB(data);
      }

      // Convert to BinData and update arduinoBins
      const binData = convertToBinData(data);
      if (binData) {
        setArduinoBins((prev) => {
          // Check if this bin already exists
          const existingIndex = prev.findIndex((bin) => bin.id === binData.id);

          if (existingIndex >= 0) {
            // Update existing bin
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              fillLevel: binData.fillLevel,
              status: binData.status,
              lastCleaned: new Date().toISOString(),
            };
            return updated;
          } else {
            // Add new bin
            return [...prev, binData];
          }
        });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from sensor backend");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SensorContext.Provider
      value={{
        isConnected,
        arduinoBins,
        latestSensorA,
        latestSensorB,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};
