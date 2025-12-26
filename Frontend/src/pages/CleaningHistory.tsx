import { useState, useEffect } from 'react';
import { Clock, Calendar, User, MapPin, Search, Filter } from 'lucide-react';
import { getCleaningHistory } from '../services/api';
import './pages.css';

interface CleaningRecord {
  sensor_id: string;
  location_name: string;
  subcity: string;
  bin_type: string;
  cleaned_at: string;
  previous_status: string;
  notes: string;
  cleaned_by: string;
}

interface CleaningHistoryProps {
  language: 'en' | 'am';
}

const translations = {
  en: {
    title: 'Cleaning History',
    search: 'Search records...',
    filter: 'Filter by',
    sensorId: 'Sensor ID',
    location: 'Location',
    subcity: 'Subcity',
    cleanedAt: 'Cleaned At',
    cleanedBy: 'Cleaned By',
    previousStatus: 'Previous Status',
    notes: 'Notes',
    status: 'Status',
    actions: 'Actions',
    noRecords: 'No cleaning records found',
    all: 'All',
    critical: 'Critical',
    warning: 'Warning',
    safe: 'Safe',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    export: 'Export',
  },
  am: {
    title: 'የማፅዳት ታሪክ',
    search: 'መዝገቦችን ይፈልጉ...',
    filter: 'በማጣሪያ',
    sensorId: 'የሴንሰር መታወቂያ',
    location: 'ቦታ',
    subcity: 'ክፍለ ከተማ',
    cleanedAt: 'የተጸዳበት ጊዜ',
    cleanedBy: 'የጸዳው',
    previousStatus: 'የቀድሞ ሁኔታ',
    notes: 'ማስታወሻዎች',
    status: 'ሁኔታ',
    actions: 'Actions',
    noRecords: 'ምንም የማፅዳት መዝገብ አልተገኘም',
    all: 'ሁሉም',
    critical: 'አስቸኳይ',
    warning: 'ማስጠንቀቂያ',
    safe: 'ደህንነቱ የተጠበቀ',
    last7Days: 'መጨረሻ 7 ቀናት',
    last30Days: 'መጨረሻ 30 ቀናት',
    export: 'ላክ',
  },
};

export function CleaningHistory({ language }: CleaningHistoryProps) {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CleaningRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const t = translations[language];

  useEffect(() => {
    fetchCleaningHistory();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [searchTerm, statusFilter, dateFilter, records]);

  const fetchCleaningHistory = async () => {
    try {
      const response = await getCleaningHistory();
      if (response.success) {
        setRecords(response.history || []);
        setFilteredRecords(response.history || []);
      }
    } catch (error) {
      console.error('Error fetching cleaning history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(record =>
        record.sensor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.cleaned_by && record.cleaned_by.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.previous_status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const days = dateFilter === '7days' ? 7 : 30;
      const cutoffDate = new Date(now.setDate(now.getDate() - days));

      filtered = filtered.filter(record => {
        const recordDate = new Date(record.cleaned_at);
        return recordDate >= cutoffDate;
      });
    }

    setFilteredRecords(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'critical':
        return 'status-critical';
      case 'warning':
        return 'status-warning';
      case 'safe':
        return 'status-safe';
      default:
        return 'status-unknown';
    }
  };

  if (loading) {
    return <div className="loading-container">{language === 'en' ? 'Loading...' : 'በመጫን ላይ...'}</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1 className="history-title">{t.title}</h1>
        
      </div>

      <div className="history-card">
        <div className="filters-container">
          <div className="filters-wrapper">
            <div className="search-section">
              <div className="search-wrapper">
                <div className="search-icon">
                  <Search className="icon" />
                </div>
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="filter-controls">
              <div className="status-filter">
                <Filter className="filter-icon" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">{t.status}: {t.all}</option>
                  <option value="critical">{t.status}: {t.critical}</option>
                  <option value="warning">{t.status}: {t.warning}</option>
                  <option value="safe">{t.status}: {t.safe}</option>
                </select>
              </div>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">{language === 'en' ? 'All Time' : 'ሁሉም ጊዜ'}</option>
                <option value="7days">{t.last7Days}</option>
                <option value="30days">{t.last30Days}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="history-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">{t.sensorId}</th>
                <th className="table-header-cell">{t.location}</th>
                <th className="table-header-cell">{t.cleanedAt}</th>
                <th className="table-header-cell">{t.previousStatus}</th>
                <th className="table-header-cell">{t.cleanedBy}</th>
                <th className="table-header-cell">{t.notes}</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data-cell">
                    {t.noRecords}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">
                      <div className="sensor-id-cell">
                        <div className="history-avatar-icon">
                          <MapPin className="history-avatar-icon-inner" />
                        </div>
                        <span className="sensor-id">{record.sensor_id}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="location-info">
                        <div className="location-name">{record.location_name}</div>
                        <div className="location-subcity">{record.subcity}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="time-cell">
                        <Clock className="time-icon" />
                        <span className="time-text">
                          {formatDate(record.cleaned_at)}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(record.previous_status)}`}>
                        {record.previous_status || 'Unknown'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="cleaner-cell">
                        {record.cleaned_by ? (
                          <>
                            <User className="cleaner-icon" />
                            <span className="cleaner-name">{record.cleaned_by}</span>
                          </>
                        ) : (
                          <span className="system-text">{language === 'en' ? 'System' : 'ስርዓት'}</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="notes-cell">
                        {record.notes || '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}