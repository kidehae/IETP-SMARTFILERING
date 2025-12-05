import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { BinData } from '../data/mockData';

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
  },
  am: {
    title: 'የክትትል ቦታዎች ካርታ',
    fillLevel: 'የመሙላት ደረጃ',
    lastCleaned: 'መጨረሻ የተጸዳበት',
    status: 'ሁኔታ',
  }
};

export function LocationMap({ language, bins }: LocationMapProps) {
  const t = translations[language];

  // Calculate map bounds
  const lats = bins.map(b => b.coordinates.lat);
  const lngs = bins.map(b => b.coordinates.lng);
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
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-visible">
      <h2 className="text-gray-900 mb-4">{t.title}</h2>
      
      <div className="relative w-full h-[500px]">
        {/* Background map layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 overflow-hidden">
          {/* Grid lines to simulate map */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-blue-300" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-blue-300" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Title overlay */}
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-10">
            <p className="text-sm text-gray-600">Addis Ababa</p>
            <p className="text-xs text-gray-500">{language === 'am' ? 'አዲስ አበባ' : 'Capital City'}</p>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-10">
            <p className="text-xs text-gray-600 mb-2">{t.status}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-xs text-gray-700">{language === 'am' ? 'አስቸኳይ' : 'Critical'} (≥90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-700">{language === 'am' ? 'ማስጠንቀቂያ' : 'Warning'} (70-89%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-xs text-gray-700">{language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Safe'} {'(<70%)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Markers layer - outside overflow-hidden */}
        {bins.map((bin) => {
          const pos = getMarkerPosition(bin.coordinates.lat, bin.coordinates.lng);
          const statusColor = getStatusColor(bin.status);
          
          return (
            <div
              key={bin.id}
              className="absolute group cursor-pointer z-10 hover:z-[10000]"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
            >
              {/* Marker */}
              <div className={`${statusColor} w-4 h-4 rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform`}>
                {bin.status === 'critical' && (
                  <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-64 z-[9999] pointer-events-none">
                <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 text-xs border-2 border-white">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold">{bin.id}</p>
                    <span className={`${statusColor} px-2 py-0.5 rounded text-white text-xs`}>
                      {bin.fillLevel}%
                    </span>
                  </div>
                  <p className="text-gray-300 mb-1">
                    {language === 'am' ? bin.subcityAm : bin.subcity}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {language === 'am' ? bin.locationAm : bin.location}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-gray-400 text-xs">
                      {t.lastCleaned}: {new Date(bin.lastCleaned).toLocaleString(language === 'am' ? 'am-ET' : 'en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
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
