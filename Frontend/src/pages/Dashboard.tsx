import { useState, useEffect } from 'react';
import { Users, Trash2, AlertTriangle, CheckCircle, BarChart3, Clock } from 'lucide-react';
import { StatusSummary } from '../components/StatusSummary';
import { LocationMap } from '../components/LocationMap';
import { AlertsList } from '../components/AlertsList';
import { SensorDisplay } from '../components/SensorDisplay';
import { useSensorData } from '../contexts/SensorContext';
import { getDashboardStats, getBinLocations } from '../services/api';
import { mockBinData } from '../data/mockData';

interface DashboardProps {
  language: 'en' | 'am';
}

interface DashboardStats {
  totalBins: number;
  activeBins: number;
  totalEmployees: number;
  todayAlerts: number;
  pendingCleanings: number;
}

const translations = {
  en: {
    title: 'Dashboard Overview',
    todayAlerts: 'Today\'s Alerts',
    pendingCleanings: 'Pending Cleanings',
    activeBins: 'Active Bins',
    totalEmployees: 'Total Employees',
    realTimeData: 'Real-time Sensor Data',
    recentAlerts: 'Recent Alerts',
    mapView: 'Bin Locations Map',
  },
  am: {
    title: 'ዳሽቦርድ አጠቃላይ እይታ',
    todayAlerts: 'የዛሬ ማንቂያዎች',
    pendingCleanings: 'በመጠባበቅ ላይ ያሉ ማፅዳቶች',
    activeBins: 'ንቁ የቆሻሻ መጣሪያዎች',
    totalEmployees: 'አጠቃላይ ሰራተኞች',
    realTimeData: 'የሴንሰር ቀጥታ ዳታ',
    recentAlerts: 'የቅርብ ማንቂያዎች',
    mapView: 'የቆሻሻ መጣሪያ ቦታዎች ካርታ',
  },
};

export function Dashboard({ language }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [binLocations, setBinLocations] = useState<any[]>([]);
  const { arduinoBins, isConnected } = useSensorData();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, binsResponse] = await Promise.all([
        getDashboardStats(),
        getBinLocations()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      if (binsResponse.success) {
        setBinLocations(binsResponse.locations);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine mock data with real bin locations
  const combinedBins = binLocations.map(location => {
    // Find matching mock data or create from location
    const mockBin = mockBinData.find(b => b.id === location.sensor_id);
    
    if (mockBin) {
      return {
        ...mockBin,
        location: location.location_name,
        subcity: location.subcity,
        coordinates: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }
      };
    }

    // Create new bin from location data
    return {
      id: location.sensor_id,
      subcity: location.subcity,
      subcityAm: location.subcity, // You might want to add Amharic names
      location: location.location_name,
      locationAm: location.location_name,
      fillLevel: Math.floor(Math.random() * 100), // You should get this from sensor data
      lastCleaned: new Date().toISOString(),
      status: 'safe' as const,
      coordinates: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }
    };
  });

  const criticalAlerts = combinedBins.filter(bin => bin.fillLevel >= 90);
  const warningAlerts = combinedBins.filter(bin => bin.fillLevel >= 70 && bin.fillLevel < 90);
  const safeBins = combinedBins.filter(bin => bin.fillLevel < 70);

  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {isConnected && (
        <div className="mb-6">
          <SensorDisplay language={language} />
        </div>
      )}

      {/* {stats && (
        <StatusSummary
          language={language}
          totalBins={stats.totalBins}
          criticalCount={criticalAlerts.length}
          warningCount={warningAlerts.length}
          safeCount={safeBins.length}
        />
      )} */}

      

      {/* {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.todayAlerts}</p>
                <p className="text-2xl font-semibold">{stats.todayAlerts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.pendingCleanings}</p>
                <p className="text-2xl font-semibold">{stats.pendingCleanings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Trash2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.activeBins}</p>
                <p className="text-2xl font-semibold">{stats.activeBins}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t.totalEmployees}</p>
                <p className="text-2xl font-semibold">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>
        </div>
      )} */}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-t-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.mapView}</h2>
          <LocationMap language={language} bins={combinedBins} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.recentAlerts}</h2>
          <AlertsList language={language} bins={combinedBins} />
        </div>
      </div>
    </div>
  );
}