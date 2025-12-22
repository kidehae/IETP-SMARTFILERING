// import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
// import { BinData } from '../data/mockData';

// interface LocationMapProps {
//   language: 'en' | 'am';
//   bins: BinData[];
// }

// const translations = {
//   en: {
//     title: 'Monitoring Locations Map',
//     fillLevel: 'Fill Level',
//     lastCleaned: 'Last Cleaned',
//     status: 'Status',
//   },
//   am: {
//     title: 'የክትትል ቦታዎች ካርታ',
//     fillLevel: 'የመሙላት ደረጃ',
//     lastCleaned: 'መጨረሻ የተጸዳበት',
//     status: 'ሁኔታ',
//   }
// };

// export function LocationMap({ language, bins }: LocationMapProps) {
//   const t = translations[language];

//   // Calculate map bounds
//   const lats = bins.map(b => b.coordinates.lat);
//   const lngs = bins.map(b => b.coordinates.lng);
//   const minLat = Math.min(...lats);
//   const maxLat = Math.max(...lats);
//   const minLng = Math.min(...lngs);
//   const maxLng = Math.max(...lngs);

//   const latRange = maxLat - minLat || 0.1;
//   const lngRange = maxLng - minLng || 0.1;

//   const getMarkerPosition = (lat: number, lng: number) => {
//     const x = ((lng - minLng) / lngRange) * 90 + 5;
//     const y = ((maxLat - lat) / latRange) * 90 + 5;
//     return { x: `${x}%`, y: `${y}%` };
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'critical':
//         return 'bg-red-600';
//       case 'warning':
//         return 'bg-yellow-500';
//       default:
//         return 'bg-green-600';
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-visible">
//       <h2 className="text-gray-900 mb-4">{t.title}</h2>
      
//       <div className="relative w-full h-[500px]">
//         {/* Background map layer */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 overflow-hidden">
//           {/* Grid lines to simulate map */}
//           <div className="absolute inset-0 opacity-20 pointer-events-none">
//             {[...Array(10)].map((_, i) => (
//               <div key={`h-${i}`} className="absolute w-full h-px bg-blue-300" style={{ top: `${i * 10}%` }} />
//             ))}
//             {[...Array(10)].map((_, i) => (
//               <div key={`v-${i}`} className="absolute h-full w-px bg-blue-300" style={{ left: `${i * 10}%` }} />
//             ))}
//           </div>

//           {/* Title overlay */}
//           <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-10">
//             <p className="text-sm text-gray-600">Addis Ababa</p>
//             <p className="text-xs text-gray-500">{language === 'am' ? 'አዲስ አበባ' : 'Capital City'}</p>
//           </div>

//           {/* Legend */}
//           <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-10">
//             <p className="text-xs text-gray-600 mb-2">{t.status}</p>
//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-red-600"></div>
//                 <span className="text-xs text-gray-700">{language === 'am' ? 'አስቸኳይ' : 'Critical'} (≥90%)</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                 <span className="text-xs text-gray-700">{language === 'am' ? 'ማስጠንቀቂያ' : 'Warning'} (70-89%)</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-green-600"></div>
//                 <span className="text-xs text-gray-700">{language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Safe'} {'(<70%)'}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Markers layer - outside overflow-hidden */}
//         {bins.map((bin) => {
//           const pos = getMarkerPosition(bin.coordinates.lat, bin.coordinates.lng);
//           const statusColor = getStatusColor(bin.status);
          
//           return (
//             <div
//               key={bin.id}
//               className="absolute group cursor-pointer z-10 hover:z-[10000]"
//               style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
//             >
//               {/* Marker */}
//               <div className={`${statusColor} w-4 h-4 rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform`}>
//                 {bin.status === 'critical' && (
//                   <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></div>
//                 )}
//               </div>

//               {/* Tooltip */}
//               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-64 z-[9999] pointer-events-none">
//                 <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 text-xs border-2 border-white">
//                   <div className="flex items-start justify-between gap-2 mb-2">
//                     <p className="font-semibold">{bin.id}</p>
//                     <span className={`${statusColor} px-2 py-0.5 rounded text-white text-xs`}>
//                       {bin.fillLevel}%
//                     </span>
//                   </div>
//                   <p className="text-gray-300 mb-1">
//                     {language === 'am' ? bin.subcityAm : bin.subcity}
//                   </p>
//                   <p className="text-gray-400 text-xs">
//                     {language === 'am' ? bin.locationAm : bin.location}
//                   </p>
//                   <div className="mt-2 pt-2 border-t border-gray-700">
//                     <p className="text-gray-400 text-xs">
//                       {t.lastCleaned}: {new Date(bin.lastCleaned).toLocaleString(language === 'am' ? 'am-ET' : 'en-US', { 
//                         month: 'short', 
//                         day: 'numeric', 
//                         hour: '2-digit', 
//                         minute: '2-digit' 
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { BinData } from '../data/mockData';
import { useSensorData } from '../contexts/SensorContext';
import './components.css';

interface LocationMapProps {
  language: 'en' | 'am';
  bins: BinData[];
}

const translations = {
  en: {
    title: 'Monitoring Locations Map',
    fillLevel: 'Fill Level',
    lastCleaned: 'Last Cleaned',
    status: 'Status',
    viewOnGoogleMaps: 'View on Google Maps',
    arduinoSensor: 'Arduino Sensor',
    staticData: 'Static Data',
  },
  am: {
    title: 'የክትትል ቦታዎች ካርታ',
    fillLevel: 'የመሙላት ደረጃ',
    lastCleaned: 'መጨረሻ የተጸዳበት',
    status: 'ሁኔታ',
    viewOnGoogleMaps: 'በጉግል ካርታ ላይ ይመልከቱ',
    arduinoSensor: 'አርዱይኖ ሴንሰር',
    staticData: 'ማስተናገድ ውሂብ',
  }
};

export function LocationMap({ language, bins }: LocationMapProps) {
  const t = translations[language];
  const { arduinoBins, isConnected } = useSensorData();

  // Combine static bins with real-time Arduino bins
  const allBins = [...bins, ...arduinoBins];

  // Calculate map bounds
  const lats = allBins.map(b => b.coordinates.lat);
  const lngs = allBins.map(b => b.coordinates.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 0.1;
  const lngRange = maxLng - minLng || 0.1;

  const getMarkerPosition = (lat: number, lng: number) => {
    const x = ((lng - minLng) / lngRange) * 90 + 5;
    const y = ((maxLat - lat) / latRange) * 90 + 5;
    return { x: `${x}%`, y: `${y}%` };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'status-critical';
      case 'warning':
        return 'status-warning';
      default:
        return 'status-safe';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="w-3 h-3" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const handleViewOnGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const isArduinoBin = (binId: string) => {
    return binId.includes('ARDUINO') || binId.includes('BIN-ARDUINO');
  };

  return (
    <div className="location-map-container">
      <h2 className="location-map-title">{t.title}</h2>
      
      <div className="connection-status">
        <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="connection-dot"></span>
          {isConnected 
            ? (language === 'en' ? 'Connected to Arduino Sensors' : 'ከአርዱይኖ ሴንሰሮች ጋር ተገናኝቷል')
            : (language === 'en' ? 'Arduino Sensors Offline' : 'አርዱይኖ ሴንሰሮች ከመስመር ውጭ ናቸው')
          }
        </div>
      </div>

      <div className="location-map-wrapper">
        {/* Background map layer */}
        <div className="map-background">
          {/* Grid lines to simulate map */}
          <div className="map-grid">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="grid-line-horizontal" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="grid-line-vertical" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Title overlay */}
          <div className="map-title-overlay">
            <p className="city-name">{language === 'am' ? 'አዲስ አበባ' : 'Addis Ababa'}</p>
            <p className="city-subtitle">{language === 'am' ? 'ዋና ከተማ' : 'Capital City'}</p>
          </div>

          {/* Legend */}
          <div className="map-legend">
            <p className="legend-title">{t.status}</p>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-dot status-critical"></div>
                <span className="legend-text">{language === 'am' ? 'አስቸኳይ' : 'Critical'} (≥90%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot status-warning"></div>
                <span className="legend-text">{language === 'am' ? 'ማስጠንቀቂያ' : 'Warning'} (70-89%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot status-safe"></div>
                <span className="legend-text">{language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Safe'} (&lt;70%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Markers layer */}
        {allBins.map((bin) => {
          const pos = getMarkerPosition(bin.coordinates.lat, bin.coordinates.lng);
          const statusColor = getStatusColor(bin.status);
          const isArduino = isArduinoBin(bin.id);
          
          return (
            <div
              key={bin.id}
              className="map-marker-container group"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => handleViewOnGoogleMaps(bin.coordinates.lat, bin.coordinates.lng)}
            >
              {/* Marker */}
              <div className={`map-marker ${statusColor} ${isArduino ? 'arduino-marker' : ''}`}>
                {bin.status === 'critical' && (
                  <div className="marker-ping"></div>
                )}
                {isArduino && (
                  <div className="arduino-indicator">
                    <span className="arduino-text">A</span>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="map-tooltip">
                <div className="tooltip-content">
                  <div className="tooltip-header">
                    <div className="tooltip-title">
                      <p className="bin-id">{bin.id}</p>
                      <div className="bin-type-indicator">
                        {isArduino ? (
                          <span className="arduino-label">{t.arduinoSensor}</span>
                        ) : (
                          <span className="static-label">{t.staticData}</span>
                        )}
                      </div>
                    </div>
                    <div className={`fill-level-badge ${statusColor}`}>
                      <span>{bin.fillLevel}%</span>
                    </div>
                  </div>
                  <p className="tooltip-subcity">
                    {language === 'am' ? bin.subcityAm : bin.subcity}
                  </p>
                  <p className="tooltip-location">
                    {language === 'am' ? bin.locationAm : bin.location}
                  </p>
                  <div className="tooltip-details">
                    <p className="tooltip-info">
                      <ClockIcon />
                      {t.lastCleaned}: {new Date(bin.lastCleaned).toLocaleString(language === 'am' ? 'am-ET' : 'en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <div className="tooltip-status">
                      {getStatusIcon(bin.status)}
                      <span className={`status-text ${statusColor}`}>
                        {bin.status === 'critical' 
                          ? (language === 'am' ? 'አስቸኳይ' : 'Critical')
                          : bin.status === 'warning'
                          ? (language === 'am' ? 'ማስጠንቀቂያ' : 'Warning')
                          : (language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Safe')
                        }
                      </span>
                    </div>
                  </div>
                  <div className="tooltip-footer">
                    <button 
                      className="view-on-maps-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOnGoogleMaps(bin.coordinates.lat, bin.coordinates.lng);
                      }}
                    >
                      <MapPin className="maps-icon" />
                      {t.viewOnGoogleMaps}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Clock icon component
const ClockIcon = () => (
  <svg className="clock-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);