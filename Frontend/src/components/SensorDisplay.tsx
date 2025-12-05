import { useSensorData } from "../contexts/SensorContext";

interface SensorDisplayProps {
  language: "en" | "am";
}

export function SensorDisplay({ language }: SensorDisplayProps) {
  const { isConnected, latestSensorA, latestSensorB } = useSensorData();

  const translations = {
    en: {
      title: "Live Sensor Data",
      sensorA: "Sensor A (Solid Waste)",
      sensorB: "Sensor B (Solid Waste)",
      distance: "Distance",
      status: "Status",
      full: "Full",
      notFull: "Not Full",
      disconnected: "Arduino Disconnected",
    },
    am: {
      title: "የሴንሰር ቀጥታ ዳታ",
      sensorA: "ሴንሰር ኤ (ጠንካራ ቆሻሻ)",
      sensorB: "ሴንሰር ቢ (ፈሳሽ ቆሻሻ)",
      distance: "ርቀት",
      status: "ሁኔታ",
      full: "ተሞልቷል",
      notFull: "አልተሞላም",
      disconnected: "አርዱይኖ አልተገናኘም",
    },
  };

  const t = translations[language];

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">{t.disconnected}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sensor A */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{t.sensorA}</h4>
          {latestSensorA ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.distance}:</span>
                <span className="font-semibold">
                  {latestSensorA.distance} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.status}:</span>
                <span
                  className={`font-semibold ${
                    latestSensorA.isFull ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {latestSensorA.isFull ? t.full : t.notFull}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Waiting for data...</p>
          )}
        </div>

        {/* Sensor B */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{t.sensorB}</h4>
          {latestSensorB ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.distance}:</span>
                <span className="font-semibold">
                  {latestSensorB.distance} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.status}:</span>
                <span
                  className={`font-semibold ${
                    latestSensorB.isFull ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {latestSensorB.isFull ? t.full : t.notFull}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Waiting for data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
