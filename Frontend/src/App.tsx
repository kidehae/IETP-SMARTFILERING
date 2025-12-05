// import { useState, useEffect } from "react";
// import { Header } from "./components/Header";
// import { StatusSummary } from "./components/StatusSummary";
// import { LocationMap } from "./components/LocationMap";
// import { AlertsList } from "./components/AlertsList";
// import { mockBinData } from "./data/mockData";
// import { useSensorData } from "./contexts/SensorContext";
// import { BinData } from "./data/mockData";

// export default function App() {
//   const [language, setLanguage] = useState<"en" | "am">("en");
//   const [selectedSubcity, setSelectedSubcity] = useState<string>("all");
//   const { arduinoBins, isConnected } = useSensorData();

//   // Combine mock data with real sensor data
//   const [combinedBins, setCombinedBins] = useState<BinData[]>(mockBinData);

//   useEffect(() => {
//     if (arduinoBins.length > 0) {
//       // Update or add Arduino bins to the existing mock data
//       const updatedBins = [...mockBinData];

//       arduinoBins.forEach((arduinoBin) => {
//         const index = updatedBins.findIndex((bin) => bin.id === arduinoBin.id);
//         if (index >= 0) {
//           // Update existing bin with real data
//           updatedBins[index] = {
//             ...updatedBins[index],
//             fillLevel: arduinoBin.fillLevel,
//             status: arduinoBin.status,
//             lastCleaned: arduinoBin.lastCleaned,
//           };
//         } else {
//           // Add new Arduino bin to the list
//           updatedBins.push(arduinoBin);
//         }
//       });

//       setCombinedBins(updatedBins);
//     }
//   }, [arduinoBins]);

//   const filteredBins =
//     selectedSubcity === "all"
//       ? combinedBins
//       : combinedBins.filter(
//           (bin) => bin.subcity.toLowerCase() === selectedSubcity.toLowerCase()
//         );

//   const criticalAlerts = filteredBins.filter((bin) => bin.fillLevel >= 90);
//   const warningAlerts = filteredBins.filter(
//     (bin) => bin.fillLevel >= 70 && bin.fillLevel < 90
//   );
//   const safeBins = filteredBins.filter((bin) => bin.fillLevel < 70);

//   // Connection status indicator
//   const ConnectionStatus = () => (
//     <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
//       <div
//         className={`w-3 h-3 rounded-full ${
//           isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
//         }`}
//       ></div>
//       <span className="text-xs bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
//         {isConnected ? "Connected to Sensors" : "Disconnected"}
//       </span>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ConnectionStatus />

//       <Header
//         language={language}
//         setLanguage={setLanguage}
//         selectedSubcity={selectedSubcity}
//         setSelectedSubcity={setSelectedSubcity}
//       />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Show Arduino status */}
//         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 rounded-full bg-blue-600"></div>
//             <span className="text-sm text-blue-800">
//               {isConnected
//                 ? "📡 Receiving live sensor data from Arduino"
//                 : "🔌 Connect Arduino to see live data"}
//             </span>
//           </div>
//           <div className="text-xs text-blue-600">
//             {arduinoBins.length > 0
//               ? `${arduinoBins.length} sensor(s) active`
//               : "Waiting for data..."}
//           </div>
//         </div>

//         <StatusSummary
//           language={language}
//           totalBins={filteredBins.length}
//           criticalCount={criticalAlerts.length}
//           warningCount={warningAlerts.length}
//           safeCount={safeBins.length}
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//           <LocationMap language={language} bins={filteredBins} />

//           <AlertsList language={language} bins={filteredBins} />
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { StatusSummary } from "./components/StatusSummary";
import { LocationMap } from "./components/LocationMap";
import { AlertsList } from "./components/AlertsList";
import { SensorDisplay } from "./components/SensorDisplay";
import { mockBinData } from "./data/mockData";
import { useSensorData } from "./contexts/SensorContext";
import { BinData } from "./data/mockData";

export default function App() {
  const [language, setLanguage] = useState<"en" | "am">("en");
  const [selectedSubcity, setSelectedSubcity] = useState<string>("all");
  const { arduinoBins, isConnected } = useSensorData();

  // Combine mock data with real sensor data
  // IMPORTANT: Arduino bins will REPLACE mock bins with the same ID
  const [combinedBins, setCombinedBins] = useState<BinData[]>(mockBinData);

  useEffect(() => {
    if (arduinoBins.length > 0) {
      // Start with mock data
      let updatedBins = [...mockBinData];

      // Replace or add Arduino bins
      arduinoBins.forEach((arduinoBin) => {
        const existingIndex = updatedBins.findIndex(
          (bin) => bin.id === arduinoBin.id
        );

        if (existingIndex >= 0) {
          // Replace the mock bin with real Arduino data
          updatedBins[existingIndex] = arduinoBin;
        } else {
          // Add new Arduino bin to the list
          updatedBins = [...updatedBins, arduinoBin];
        }
      });

      setCombinedBins(updatedBins);
    } else {
      // If no Arduino data, use only mock data
      setCombinedBins(mockBinData);
    }
  }, [arduinoBins]);

  const filteredBins =
    selectedSubcity === "all"
      ? combinedBins
      : combinedBins.filter(
          (bin) => bin.subcity.toLowerCase() === selectedSubcity.toLowerCase()
        );

  const criticalAlerts = filteredBins.filter((bin) => bin.fillLevel >= 90);
  const warningAlerts = filteredBins.filter(
    (bin) => bin.fillLevel >= 70 && bin.fillLevel < 90
  );
  const safeBins = filteredBins.filter((bin) => bin.fillLevel < 70);

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      ></div>
      <span className="text-xs bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
        {isConnected ? "Connected to Sensors" : "Disconnected"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />

      <Header
        language={language}
        setLanguage={setLanguage}
        selectedSubcity={selectedSubcity}
        setSelectedSubcity={setSelectedSubcity}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Show Arduino status */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-sm text-blue-800">
              {isConnected
                ? "📡 Receiving live sensor data from Arduino"
                : "🔌 Connect Arduino to see live data"}
            </span>
          </div>
          <div className="text-xs text-blue-600">
            {arduinoBins.length > 0
              ? `${arduinoBins.length} sensor(s) active`
              : "Waiting for data..."}
          </div>
        </div>

        {/* Show Sensor Display */}
        {isConnected && (
          <div className="mb-6">
            <SensorDisplay language={language} />
          </div>
        )}

        <StatusSummary
          language={language}
          totalBins={filteredBins.length}
          criticalCount={criticalAlerts.length}
          warningCount={warningAlerts.length}
          safeCount={safeBins.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <LocationMap language={language} bins={filteredBins} />
          <AlertsList language={language} bins={filteredBins} />
        </div>

        {/* Debug: Show which bins are from Arduino */}
        {/* {process.env.NODE_ENV === "development" && arduinoBins.length > 0 && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Debug: Arduino Bins
            </h3>
            <pre className="text-xs text-gray-600">
              {JSON.stringify(arduinoBins, null, 2)}
            </pre>
          </div>
        )} */}
      </main>
    </div>
  );
}
