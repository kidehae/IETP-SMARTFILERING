
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

// // BinData interface from your mock data
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
//   arduinoBins: BinData[];
//   latestSensorA: SensorData | null;
//   latestSensorB: SensorData | null;
// }

// const SensorContext = createContext<SensorContextType>({
//   isConnected: false,
//   arduinoBins: [],
//   latestSensorA: null,
//   latestSensorB: null,
// });

// export const useSensorData = () => useContext(SensorContext);

// export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [latestSensorA, setLatestSensorA] = useState<SensorData | null>(null);
//   const [latestSensorB, setLatestSensorB] = useState<SensorData | null>(null);
//   const [arduinoBins, setArduinoBins] = useState<BinData[]>([]);

//   // Map sensor IDs to specific bins
//   const sensorBinMap = {
//     A: {
//       id: "BIN-ARDUINO-A",
//       subcity: "Bole",
//       subcityAm: "ቦሌ",
//       location: "Sensor A - Solid Waste Bin (Arduino)",
//       locationAm: "ሴንሰር ኤ - ጠንካራ ቆሻሻ መጣሪያ (አርዱይኖ)",
//       coordinates: { lat: 8.9958, lng: 38.7856 },
//     },
//     B: {
//       id: "BIN-ARDUINO-B",
//       subcity: "Kirkos",
//       subcityAm: "ቂርቆስ",
//       location: "Sensor B - Solid Waste Bin (Arduino)",
//       locationAm: "ሴንሰር ቢ - ጠንካራ ቆሻሻ መጣሪያ (አርዱይኖ)",
//       coordinates: { lat: 8.9967, lng: 38.7969 },
//     },
//   };

//   // Convert distance to fill level (0-300cm becomes 0-100%)
//   const distanceToFillLevel = (distance: number): number => {
//     const maxDistance = 55; // Maximum distance Arduino can measure
//     // If distance is 0cm, bin is 100% full
//     // If distance is 55cm, bin is 0% full
//     const fillLevel = Math.max(
//       0,
//       100 - Math.round((distance / maxDistance) * 100)
//     );
//     return Math.min(100, fillLevel); // Cap at 100%
//   };

//   // Determine status based on fill level
//   const getStatus = (fillLevel: number): "critical" | "warning" | "safe" => {
//     if (fillLevel >= 90) return "critical";
//     if (fillLevel >= 70) return "warning";
//     return "safe";
//   };

//   // Convert Arduino sensor data to BinData format
//   const convertToBinData = (sensorData: SensorData): BinData | null => {
//     const binInfo =
//       sensorBinMap[sensorData.sensorId as keyof typeof sensorBinMap];
//     if (!binInfo) return null;

//     const fillLevel = distanceToFillLevel(sensorData.distance);
//     const status = getStatus(fillLevel);

//     return {
//       id: binInfo.id,
//       subcity: binInfo.subcity,
//       subcityAm: binInfo.subcityAm,
//       location: binInfo.location,
//       locationAm: binInfo.locationAm,
//       fillLevel,
//       lastCleaned: new Date().toISOString(), // Update with current time
//       status,
//       coordinates: binInfo.coordinates,
//     };
//   };

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

//       // Update latest sensor readings
//       if (data.sensorId === "A") {
//         setLatestSensorA(data);
//       } else if (data.sensorId === "B") {
//         setLatestSensorB(data);
//       }

//       // Convert to BinData and update arduinoBins
//       const binData = convertToBinData(data);
//       if (binData) {
//         setArduinoBins((prev) => {
//           // Check if this bin already exists
//           const existingIndex = prev.findIndex((bin) => bin.id === binData.id);

//           if (existingIndex >= 0) {
//             // Update existing bin
//             const updated = [...prev];
//             updated[existingIndex] = {
//               ...updated[existingIndex],
//               fillLevel: binData.fillLevel,
//               status: binData.status,
//               lastCleaned: new Date().toISOString(),
//             };
//             return updated;
//           } else {
//             // Add new bin
//             return [...prev, binData];
//           }
//         });
//       }
//     });

//     newSocket.on("disconnect", () => {
//       console.log("❌ Disconnected from sensor backend");
//       setIsConnected(false);
//     });

//     // Cleanup on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return (
//     <SensorContext.Provider
//       value={{
//         isConnected,
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
import { getBinLocations, getCleaningHistory } from "../services/api";

// Define the structure of sensor data from Arduino
interface SensorData {
  sensorId: string;
  distance: number;
  timestamp: number;
  isFull: boolean;
  receivedAt: number;
}

// BinData interface matching your backend structure
interface BinData {
  id: number;
  sensor_id: string;
  subcity: string;
  location_name: string;
  latitude: number;
  longitude: number;
  bin_type: string;
  address?: string;
  is_active: boolean;
  created_at: string;
}

// Frontend display data
interface FrontendBinData extends BinData {
  fillLevel: number;
  lastCleaned: string;
  status: "critical" | "warning" | "safe";
  coordinates: { lat: number; lng: number };
  subcityAm: string;
  locationAm: string;
}

interface SensorContextType {
  isConnected: boolean;
  arduinoBins: FrontendBinData[];
  latestSensorReadings: Map<string, SensorData>;
  isLoading: boolean;
  refreshBinData: () => Promise<void>;
}

const SensorContext = createContext<SensorContextType>({
  isConnected: false,
  arduinoBins: [],
  latestSensorReadings: new Map(),
  isLoading: true,
  refreshBinData: async () => {},
});

export const useSensorData = () => useContext(SensorContext);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [latestSensorReadings, setLatestSensorReadings] = useState<Map<string, SensorData>>(new Map());
  const [arduinoBins, setArduinoBins] = useState<FrontendBinData[]>([]);

  // Helper function to get Amharic subcity name
  const getAmharicSubcity = (englishSubcity: string): string => {
    const subcityMap: Record<string, string> = {
      "Addis Ketema": "አዲስ ከተማ",
      "Akaky Kaliti": "አካኪ ቃሊቲ",
      "Arada": "አራዳ",
      "Bole": "ቦሌ",
      "Gullele": "ጉለሌ",
      "Kirkos": "ቂርቆስ",
      "Kolfe Keranio": "ቆልፌ ቀራንዮ",
      "Lideta": "ልደታ",
      "Nifas Silk-Lafto": "ንፋስ ስልክ ላፍቶ",
      "Yeka": "የካ"
    };
    return subcityMap[englishSubcity] || englishSubcity;
  };

  // Convert distance to fill level
  const distanceToFillLevel = (distance: number): number => {
    const maxDistance = 55;
    const fillLevel = Math.max(0, 100 - Math.round((distance / maxDistance) * 100));
    return Math.min(100, fillLevel);
  };

  // Determine status based on fill level
  const getStatus = (fillLevel: number): "critical" | "warning" | "safe" => {
    if (fillLevel >= 90) return "critical";
    if (fillLevel >= 70) return "warning";
    return "safe";
  };

  // Function to refresh bin data from API
  const refreshBinData = async () => {
    try {
      setIsLoading(true);
      
      const binResponse = await getBinLocations();
      const binLocations: BinData[] = binResponse.locations || [];
      
      const cleaningResponse = await getCleaningHistory();
      const cleaningHistory = cleaningResponse.history || [];
      
      // Create a map of latest cleaning for each sensor
      const lastCleaningMap = new Map<string, string>();
      cleaningHistory.forEach((record: any) => {
        if (record.sensor_id && record.cleaned_at) {
          lastCleaningMap.set(record.sensor_id, record.cleaned_at);
        }
      });
      
      // Transform to frontend format
      const transformedBins: FrontendBinData[] = binLocations
        .filter(bin => bin.is_active)
        .map(bin => {
          const lastCleaned = lastCleaningMap.get(bin.sensor_id) || bin.created_at;
          const defaultFillLevel = 0;
          const status = getStatus(defaultFillLevel);
          const subcityAm = getAmharicSubcity(bin.subcity);
          
          return {
            ...bin,
            fillLevel: defaultFillLevel,
            lastCleaned,
            status,
            coordinates: { lat: bin.latitude, lng: bin.longitude },
            subcityAm,
            locationAm: bin.location_name, // Same as English for now
          };
        });
      
      setArduinoBins(transformedBins);
    } catch (error) {
      console.error("Error refreshing bin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process sensor data and update bins
  const processSensorData = (data: SensorData) => {
    const fillLevel = distanceToFillLevel(data.distance);
    const status = getStatus(fillLevel);
    
    setArduinoBins(prev => {
      return prev.map(bin => {
        if (bin.sensor_id === data.sensorId) {
          // Update lastCleaned only if bin is now safe (empty/cleaned)
          const lastCleaned = status === "safe" ? new Date().toISOString() : bin.lastCleaned;
          
          return {
            ...bin,
            fillLevel,
            status,
            lastCleaned,
          };
        }
        return bin;
      });
    });
  };

  useEffect(() => {
    refreshBinData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to sensor backend");
      setIsConnected(true);
    });

    newSocket.on("sensor-data", (data: SensorData) => {
      console.log("📡 Received sensor data:", data);

      // Update latest sensor readings
      setLatestSensorReadings(prev => {
        const newMap = new Map(prev);
        newMap.set(data.sensorId, data);
        return newMap;
      });

      // Process the sensor data
      processSensorData(data);
      
      // Log status changes
      const fillLevel = distanceToFillLevel(data.distance);
      const status = getStatus(fillLevel);
      
      if (status === "critical") {
        console.log(`🚨 Sensor ${data.sensorId} is CRITICAL: ${fillLevel}% full`);
      } else if (status === "warning") {
        console.log(`⚠️ Sensor ${data.sensorId} is WARNING: ${fillLevel}% full`);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from sensor backend");
      setIsConnected(false);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isLoading]);

  return (
    <SensorContext.Provider
      value={{
        isConnected,
        arduinoBins,
        latestSensorReadings,
        isLoading,
        refreshBinData,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};