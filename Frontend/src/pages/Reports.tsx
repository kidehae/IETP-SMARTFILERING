import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';
import './pages.css';

interface ReportsProps {
  language: 'en' | 'am';
}

const translations = {
  en: {
    title: 'Reports & Analytics',
    monthlyReport: 'Monthly Report',
    weeklyReport: 'Weekly Report',
    binStatus: 'Bin Status Distribution',
    cleaningTrends: 'Cleaning Trends',
    export: 'Export Report',
    download: 'Download',
    comingSoon: 'Advanced analytics coming soon...',
    totalCleanings: 'Total Cleanings',
    avgResponseTime: 'Avg Response Time',
    efficiencyRate: 'Efficiency Rate',
    alertsGenerated: 'Alerts Generated',
  },
  am: {
    title: 'ሪፖርቶች እና ትንተና',
    monthlyReport: 'ወርሃዊ ሪፖርት',
    weeklyReport: 'ሳምንታዊ ሪፖርት',
    binStatus: 'የቆሻሻ መጣሪያ ሁኔታ ስርጭት',
    cleaningTrends: 'የማፅዳት አዝማሚያዎች',
    export: 'ሪፖርት ላክ',
    download: 'አውርድ',
    comingSoon: 'የላቀ ትንተና በቅርቡ ይመጣል...',
    totalCleanings: 'ጠቅላላ የማፅዳት',
    avgResponseTime: 'አማካይ የምላሽ ጊዜ',
    efficiencyRate: 'ውጤታማነት መጠን',
    alertsGenerated: 'የተፈጠሩ ማንቂያዎች',
  },
};

export function Reports({ language }: ReportsProps) {
  const t = translations[language];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">{t.title}</h1>
        
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-content">
            <div>
              <p className="metric-label">{t.totalCleanings}</p>
              <p className="metric-value">1,248</p>
            </div>
            <div className="metric-icon-wrapper metric-icon-blue">
              <BarChart3 className="metric-icon" />
            </div>
          </div>
          <div className="metric-trend">
            <p className="metric-trend-positive">+12% from last month</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-content">
            <div>
              <p className="metric-label">{t.avgResponseTime}</p>
              <p className="metric-value">2.4h</p>
            </div>
            <div className="metric-icon-wrapper metric-icon-green">
              <TrendingUp className="metric-icon" />
            </div>
          </div>
          <div className="metric-trend">
            <p className="metric-trend-positive">-0.5h from last month</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-content">
            <div>
              <p className="metric-label">{t.efficiencyRate}</p>
              <p className="metric-value">94%</p>
            </div>
            <div className="metric-icon-wrapper metric-icon-yellow">
              <PieChart className="metric-icon" />
            </div>
          </div>
          <div className="metric-trend">
            <p className="metric-trend-positive">+3% from last month</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-content">
            <div>
              <p className="metric-label">{t.alertsGenerated}</p>
              <p className="metric-value">89</p>
            </div>
            <div className="metric-icon-wrapper metric-icon-red">
              <BarChart3 className="metric-icon" />
            </div>
          </div>
          <div className="metric-trend">
            <p className="metric-trend-negative">-5 from last month</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h2 className="chart-card-title">{t.monthlyReport}</h2>
            
          </div>
          <div className="chart-placeholder">
            <div className="chart-placeholder-content">
              <BarChart3 className="chart-placeholder-icon" />
              <p className="chart-placeholder-text">{t.comingSoon}</p>
            </div>
          </div>
        </div>

        <div className="report-chart-card">
          <div className="chart-card-header">
            <h2 className="chart-card-title">{t.binStatus}</h2>
            
          </div>
          <div className="chart-placeholder">
            <div className="chart-placeholder-content">
              <PieChart className="chart-placeholder-icon" />
              <p className="chart-placeholder-text">{t.comingSoon}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}