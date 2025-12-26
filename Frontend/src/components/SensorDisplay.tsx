// import { useSensorData } from "../contexts/SensorContext";

// interface SensorDisplayProps {
//   language: "en" | "am";
// }

// export function SensorDisplay({ language }: SensorDisplayProps) {
//   const { isConnected, latestSensorA, latestSensorB } = useSensorData();

//   const translations = {
//     en: {
//       title: "Live Sensor Data",
//       sensorA: "Sensor A (Solid Waste)",
//       sensorB: "Sensor B (Solid Waste)",
//       distance: "Distance",
//       status: "Status",
//       full: "Full",
//       notFull: "Not Full",
//       disconnected: "Arduino Disconnected",
//     },
//     am: {
//       title: "የሴንሰር ቀጥታ ዳታ",
//       sensorA: "ሴንሰር ኤ (ጠንካራ ቆሻሻ)",
//       sensorB: "ሴንሰር ቢ (ፈሳሽ ቆሻሻ)",
//       distance: "ርቀት",
//       status: "ሁኔታ",
//       full: "ተሞልቷል",
//       notFull: "አልተሞላም",
//       disconnected: "አርዱይኖ አልተገናኘም",
//     },
//   };

//   const t = translations[language];

//   if (!isConnected) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//         <p className="text-yellow-800">{t.disconnected}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.title}</h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Sensor A */}
//         <div className="border border-gray-200 rounded-lg p-4">
//           <h4 className="font-medium text-gray-900 mb-2">{t.sensorA}</h4>
//           {latestSensorA ? (
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{t.distance}:</span>
//                 <span className="font-semibold">
//                   {latestSensorA.distance} cm
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{t.status}:</span>
//                 <span
//                   className={`font-semibold ${
//                     latestSensorA.isFull ? "text-red-600" : "text-green-600"
//                   }`}
//                 >
//                   {latestSensorA.isFull ? t.full : t.notFull}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">Waiting for data...</p>
//           )}
//         </div>

//         {/* Sensor B */}
//         <div className="border border-gray-200 rounded-lg p-4">
//           <h4 className="font-medium text-gray-900 mb-2">{t.sensorB}</h4>
//           {latestSensorB ? (
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{t.distance}:</span>
//                 <span className="font-semibold">
//                   {latestSensorB.distance} cm
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{t.status}:</span>
//                 <span
//                   className={`font-semibold ${
//                     latestSensorB.isFull ? "text-red-600" : "text-green-600"
//                   }`}
//                 >
//                   {latestSensorB.isFull ? t.full : t.notFull}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">Waiting for data...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useSensorData } from "../contexts/SensorContext";
import { Activity, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

interface SensorDisplayProps {
  language: "en" | "am";
}

export function SensorDisplay({ language }: SensorDisplayProps) {
  const { isConnected, latestSensorReadings, arduinoBins } = useSensorData();

  const translations = {
    en: {
      title: "Live Sensor Data",
      allSensors: "All Sensors",
      sensor: "Sensor",
      distance: "Distance",
      fillLevel: "Fill Level",
      status: "Status",
      full: "Full",
      notFull: "Not Full",
      disconnected: "Arduino Disconnected",
      connectArduino: "Connect Arduino to see real-time sensor data",
      waitingForData: "Waiting for sensor data...",
      lastUpdate: "Last Update",
      critical: "Critical",
      warning: "Warning",
      safe: "Safe",
      activeSensors: "Active Sensors",
      noActiveSensors: "No active sensors",
    },
    am: {
      title: "የሴንሰር ቀጥታ ዳታ",
      allSensors: "ሁሉም ሴንሰሮች",
      sensor: "ሴንሰር",
      distance: "ርቀት",
      fillLevel: "የመሙላት ደረጃ",
      status: "ሁኔታ",
      full: "ተሞልቷል",
      notFull: "አልተሞላም",
      disconnected: "አርዱይኖ አልተገናኘም",
      connectArduino: "ቀጥተኛ የሴንሰር ዳታ ለማየት አርዱይኖ ያገናኙ",
      waitingForData: "የሴንሰር ዳታ በመጠበቅ ላይ...",
      lastUpdate: "መጨረሻ ዝመና",
      critical: "አስቸኳይ",
      warning: "ማስጠንቀቂያ",
      safe: "ደህንነቱ የተጠበቀ",
      activeSensors: "ንቁ ሴንሰሮች",
      noActiveSensors: "ምንም ንቁ ሴንሰሮች የሉም",
    },
  };

  const t = translations[language];

  const getStatusBadge = (status: "critical" | "warning" | "safe", isFull: boolean) => {
    const badges = {
      critical: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: t.critical
      },
      warning: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: t.warning
      },
      safe: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: t.safe
      }
    };

    const badge = badges[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${badge.bg} ${badge.text} ${badge.border}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getFillLevel = (distance: number): number => {
    const maxDistance = 55;
    const fillLevel = Math.max(0, 100 - Math.round((distance / maxDistance) * 100));
    return Math.min(100, fillLevel);
  };

  const getStatus = (distance: number): "critical" | "warning" | "safe" => {
    const fillLevel = getFillLevel(distance);
    if (fillLevel >= 90) return "critical";
    if (fillLevel >= 70) return "warning";
    return "safe";
  };

  // Convert Map to array of sensor readings
  const sensorReadings = Array.from(latestSensorReadings.entries()).map(([sensorId, data]) => ({
    sensorId,
    distance: data.distance,
    isFull: data.isFull,
    timestamp: data.timestamp,
    fillLevel: getFillLevel(data.distance),
    status: getStatus(data.distance)
  }));

  // Get active Arduino bins with sensor data
  const activeSensors = arduinoBins.filter(bin => {
    const sensorReading = latestSensorReadings.get(bin.sensor_id);
    return sensorReading && Date.now() - sensorReading.receivedAt < 60000; // Active if data received in last minute
  });

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <WifiOff className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">{t.disconnected}</p>
            <p className="text-sm text-yellow-700 mt-1">{t.connectArduino}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Wifi className="w-3 h-3" />
                <span>{language === "am" ? "ተገናኝቷል" : "Connected"}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {activeSensors.length} {activeSensors.length === 1 ? t.sensor : t.activeSensors}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {new Date().toLocaleTimeString(language === "am" ? "am-ET" : "en-US", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      {sensorReadings.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <Activity className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600">{t.waitingForData}</p>
            <p className="text-sm text-gray-500">
              {language === "am" 
                ? "አርዱይኖ ሴንሰሮች መረጃ ይላኩ ዘንድ ይጠብቁ"
                : "Waiting for Arduino sensors to send data"}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Active sensors summary */}
          {/* <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">{t.activeSensors}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {activeSensors.length > 0 ? (
                activeSensors.map(bin => (
                  <div key={bin.sensor_id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{bin.sensor_id}</span>
                      {getStatusBadge(bin.status, bin.fillLevel >= 90)}
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            bin.fillLevel >= 90 ? 'bg-red-600' :
                            bin.fillLevel >= 70 ? 'bg-yellow-500' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{t.fillLevel}</span>
                        <span>{bin.fillLevel}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500">
                  {t.noActiveSensors}
                </div>
              )}
            </div>
          </div> */}

          {/* Latest sensor readings */}
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t.lastUpdate}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensorReadings.map((sensor) => (
              <div 
                key={sensor.sensorId} 
                className={`border rounded-lg p-4 ${
                  sensor.status === "critical" ? "border-red-200 bg-red-50" :
                  sensor.status === "warning" ? "border-yellow-200 bg-yellow-50" :
                  "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${
                      sensor.status === "critical" ? "bg-red-100" :
                      sensor.status === "warning" ? "bg-yellow-100" :
                      "bg-green-100"
                    }`}>
                      {sensor.status === "critical" || sensor.status === "warning" ? (
                        <AlertCircle className={`w-4 h-4 ${
                          sensor.status === "critical" ? "text-red-600" : "text-yellow-600"
                        }`} />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {t.sensor} {sensor.sensorId}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(sensor.timestamp).toLocaleTimeString(language === "am" ? "am-ET" : "en-US", {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">{t.distance}</p>
                      <p className="font-semibold text-lg">{sensor.distance} cm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">{t.fillLevel}</p>
                      <p className={`font-semibold text-lg ${
                        sensor.fillLevel >= 90 ? "text-red-600" :
                        sensor.fillLevel >= 70 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {sensor.fillLevel}%
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.status}</span>
                      {getStatusBadge(sensor.status, sensor.isFull)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Connection status footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-gray-600">
              {isConnected 
                ? (language === "am" ? "ከአርዱይኖ ጋር ተገናኝቷል" : "Connected to Arduino")
                : (language === "am" ? "ከአርዱይኖ ጋር ተገናኝቷል የለም" : "Disconnected from Arduino")
              }
            </span>
          </div>
          <span className="text-gray-500">
            {sensorReadings.length} {language === "am" ? "የቅርብ ማንበብ" : "recent readings"}
          </span>
        </div>
      </div>
    </div>
  );
}