import { MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useSensorData } from '../contexts/SensorContext';
import './components.css';

interface LocationMapProps {
  language: 'en' | 'am';
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
    noData: 'No bin locations available',
    loading: 'Loading bin locations...',
    connectArduino: 'Connect Arduino to see real-time data',
    arduinoOffline: 'Arduino Sensors Offline',
  },
  am: {
    title: 'የክትትል ቦታዎች ካርታ',
    fillLevel: 'የመሙላት ደረጃ',
    lastCleaned: 'መጨረሻ የተጸዳበት',
    status: 'ሁኔታ',
    viewOnGoogleMaps: 'በጉግል ካርታ ላይ ይመልከቱ',
    arduinoSensor: 'አርዱይኖ ሴንሰር',
    staticData: 'ማስተናገድ ውሂብ',
    noData: 'ምንም የቆሻሻ መጣሪያ ቦታዎች የሉም',
    loading: 'የቆሻሻ መጣሪያ ቦታዎች በመጫን ላይ...',
    connectArduino: 'አርዱይኖ ያገናኙ ቀጥተኛ ዳታ ለማየት',
    arduinoOffline: 'አርዱይኖ ሴንሰሮች ከመስመር ውጭ ናቸው',
  }
};

// Define the bin type for display
interface DisplayBin {
  id: string;
  subcity: string;
  subcityAm: string;
  location: string;
  locationAm: string;
  fillLevel: number;
  lastCleaned: string;
  status: "critical" | "warning" | "safe";
  coordinates: { lat: number; lng: number };
  sensor_id?: string;
  isArduino?: boolean;
}

export function LocationMap({ language }: LocationMapProps) {
  const t = translations[language];
  const { arduinoBins, isConnected, isLoading } = useSensorData();

  // Transform arduinoBins to display format
  const displayBins: DisplayBin[] = arduinoBins.map(bin => ({
    id: bin.sensor_id || String(bin.id),
    subcity: bin.subcity,
    subcityAm: bin.subcityAm || bin.subcity,
    location: bin.location_name,
    locationAm: bin.locationAm || bin.location_name,
    fillLevel: bin.fillLevel,
    lastCleaned: bin.lastCleaned,
    status: bin.status,
    coordinates: bin.coordinates,
    sensor_id: bin.sensor_id,
    isArduino: true,
  }));

  // If no bins available
  if (isLoading) {
    return (
      <div className="location-map-container">
        <h2 className="location-map-title">{t.title}</h2>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (displayBins.length === 0) {
    return (
      <div className="location-map-container">
        <h2 className="location-map-title">{t.title}</h2>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <MapPin className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">{t.noData}</p>
          <p className="text-sm text-gray-400">
            {language === 'am' 
              ? 'የቆሻሻ መጣሪያ ቦታዎችን ያክሉ ወይም አርዱይኖ ያገናኙ'
              : 'Add bin locations or connect Arduino sensors'}
          </p>
        </div>
      </div>
    );
  }

  // Calculate map bounds
  const lats = displayBins.map(b => b.coordinates.lat);
  const lngs = displayBins.map(b => b.coordinates.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 0.1;
  const lngRange = maxLng - minLng || 0.1;

  const getMarkerPosition = (lat: number, lng: number) => {
    const x = ((lng - minLng) / lngRange) * 50 + 5;
    const y = ((maxLat - lat) / latRange) * 40 + 5;
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

  const isArduinoBin = (bin: DisplayBin) => {
    return bin.isArduino || !!bin.sensor_id;
  };

  return (
    <div className="location-map-container">
      <h2 className="location-map-title">{t.title}</h2>
      
      <div className="connection-status">
        <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="connection-dot"></span>
          {isConnected 
            ? (language === 'en' ? 'Connected to Arduino Sensors' : 'ከአርዱይኖ ሴንሰሮች ጋር ተገናኝቷል')
            : t.arduinoOffline
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
              <div className="legend-item">
                <div className="legend-dot arduino-marker"></div>
                <span className="legend-text">{t.arduinoSensor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Markers layer */}
        {displayBins.map((bin) => {
          const pos = getMarkerPosition(bin.coordinates.lat, bin.coordinates.lng);
          const statusColor = getStatusColor(bin.status);
          const isArduino = isArduinoBin(bin);
          
          return (
            <div
              key={`${bin.id}-${bin.coordinates.lat}-${bin.coordinates.lng}`}
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
                    <span className="arduino-text">{bin.id}</span>
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
                      <Clock className="w-3 h-3 mr-1 inline" />
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

      {/* Bin count summary */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          {language === 'am' 
            ? `አጠቃላይ ${displayBins.length} የቆሻሻ መጣሪያ ቦታዎች`
            : `Total ${displayBins.length} bin locations`
          }
          {' • '}
          {language === 'am'
            ? `${displayBins.filter(b => b.isArduino).length} አርዱይኖ ተገናኝተዋል`
            : `${displayBins.filter(b => b.isArduino).length} Arduino sensors connected`
          }
        </p>
      </div>
    </div>
  );
}