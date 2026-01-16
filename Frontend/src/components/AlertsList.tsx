import { AlertCircle, MapPin, Clock, TrendingUp } from 'lucide-react';
import { useSensorData } from '../contexts/SensorContext';

interface AlertsListProps {
  language: 'en' | 'am';
}

const translations = {
  en: {
    title: 'Monitoring Status & Alerts',
    location: 'Location',
    fillLevel: 'Fill Level',
    lastCleaned: 'Last Cleaned',
    noBins: 'No monitoring points available',
    requiresAction: 'Requires immediate action',
    scheduleClean: 'Schedule cleaning',
    normal: 'Normal operation',
  },
  am: {
    title: 'የክትትል ሁኔታ እና ማንቂያዎች',
    location: 'ቦታ',
    fillLevel: 'የመሙላት ደረጃ',
    lastCleaned: 'መጨረሻ የተጸዳበት',
    noBins: 'ምንም የክትትል ነጥቦች የሉም',
    requiresAction: 'ወዲያውኑ እርምጃ ያስፈልጋል',
    scheduleClean: 'ማፅዳትን መርሐግብር',
    normal: 'መደበኛ አሠራር',
  }
};

// Define the bin type used in SensorContext
interface SensorBin {
  id: number;
  sensor_id: string;
  subcity: string;
  subcityAm?: string;
  location_name: string;
  locationAm?: string;
  fillLevel: number;
  lastCleaned: string;
  status: 'critical' | 'warning' | 'safe';
  coordinates: { lat: number; lng: number };
}

export function AlertsList({ language }: AlertsListProps) {
  const { arduinoBins, isLoading } = useSensorData();
  const t = translations[language];

  // Sort bins by fill level (highest first)
  const sortedBins = [...arduinoBins].sort((a, b) => b.fillLevel - a.fillLevel);

  const getStatusBadge = (status: string, fillLevel: number) => {
    const badges = {
      critical: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-600',
        label: language === 'am' ? 'አስቸኳይ' : 'CRITICAL'
      },
      warning: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500',
        label: language === 'am' ? 'ማስጠንቀቂያ' : 'WARNING'
      },
      safe: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        dot: 'bg-green-600',
        label: language === 'am' ? 'ደህና' : 'SAFE'
      }
    };

    const badge = badges[status as keyof typeof badges];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${badge.bg} ${badge.text} ${badge.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${status === 'critical' ? 'animate-pulse' : ''}`}></span>
        {badge.label}
      </span>
    );
  };

  const getActionMessage = (status: string) => {
    switch (status) {
      case 'critical':
        return t.requiresAction;
      case 'warning':
        return t.scheduleClean;
      default:
        return t.normal;
    }
  };

  const formatTimeSince = (date: string) => {
    const now = new Date();
    const cleaned = new Date(date);
    const hours = Math.floor((now.getTime() - cleaned.getTime()) / (1000 * 60 * 60));
    
    if (hours < 1) {
      return language === 'am' ? 'ከ 1 ሰዓት በፊት' : 'Less than 1 hour ago';
    } else if (hours < 24) {
      return language === 'am' ? `ከ ${hours} ሰዓት በፊት` : `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return language === 'am' ? `ከ ${days} ቀን በፊት` : `${days} days ago`;
    }
  };

  // Format date to local time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">{t.title}</h2>
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p>{language === 'am' ? 'በመጫን ላይ...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-900">{t.title}</h2>
        <div className="text-sm text-gray-500">
          {sortedBins.length} {language === 'am' ? 'ቦታዎች' : 'locations'}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sortedBins.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t.noBins}</p>
            <p className="text-sm mt-2">
              {language === 'am' 
                ? 'አርዱይኖ ሴንሰርዎችን ያገናኙ ወይም የቆሻሻ መጣሪያዎችን ይጨምሩ'
                : 'Connect Arduino sensors or add bin locations'}
            </p>
          </div>
        ) : (
          sortedBins.map((bin) => (
            <div
              key={bin.sensor_id || bin.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                bin.status === 'critical' 
                  ? 'bg-red-50 border-red-200' 
                  : bin.status === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900 font-medium">
                      {language === 'am' ? `ቦታ ${bin.sensor_id || bin.id}` : `Location ${bin.sensor_id || bin.id}`}
                    </span>
                    {getStatusBadge(bin.status, bin.fillLevel)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {language === 'am' ? (bin.subcityAm || bin.subcity) : bin.subcity}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl ${
                      bin.fillLevel >= 90 ? 'text-red-600' :
                      bin.fillLevel >= 70 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {bin.fillLevel}
                    </span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.fillLevel}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      bin.fillLevel >= 90 ? 'bg-red-600' :
                      bin.fillLevel >= 70 ? 'bg-yellow-500' :
                      'bg-green-600'
                    }`}
                    style={{ width: `${bin.fillLevel}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    {language === 'am' ? (bin.locationAm || bin.location_name) : bin.location_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {t.lastCleaned}: {formatTimeSince(bin.lastCleaned)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(bin.lastCleaned)}
                </div>
                {bin.status !== 'safe' && (
                  <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-200">
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
                      bin.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className={
                      bin.status === 'critical' ? 'text-red-700' : 'text-yellow-700'
                    }>
                      {getActionMessage(bin.status)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}