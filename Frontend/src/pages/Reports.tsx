// import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';

// interface ReportsProps {
//   language: 'en' | 'am';
// }

// const translations = {
//   en: {
//     title: 'Reports & Analytics',
//     monthlyReport: 'Monthly Report',
//     weeklyReport: 'Weekly Report',
//     binStatus: 'Bin Status Distribution',
//     cleaningTrends: 'Cleaning Trends',
//     export: 'Export Report',
//     download: 'Download',
//     comingSoon: 'Advanced analytics coming soon...',
//     totalCleanings: 'Total Cleanings',
//     avgResponseTime: 'Avg Response Time',
//     efficiencyRate: 'Efficiency Rate',
//     alertsGenerated: 'Alerts Generated',
//   },
//   am: {
//     title: 'ሪፖርቶች እና ትንተና',
//     monthlyReport: 'ወርሃዊ ሪፖርት',
//     weeklyReport: 'ሳምንታዊ ሪፖርት',
//     binStatus: 'የቆሻሻ መጣሪያ ሁኔታ ስርጭት',
//     cleaningTrends: 'የማፅዳት አዝማሚያዎች',
//     export: 'ሪፖርት ላክ',
//     download: 'አውርድ',
//     comingSoon: 'የላቀ ትንተና በቅርቡ ይመጣል...',
//     totalCleanings: 'ጠቅላላ የማፅዳት',
//     avgResponseTime: 'አማካይ የምላሽ ጊዜ',
//     efficiencyRate: 'ውጤታማነት መጠን',
//     alertsGenerated: 'የተፈጠሩ ማንቂያዎች',
//   },
// };

// export function Reports({ language }: ReportsProps) {
//   const t = translations[language];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
//         <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//           <Download className="w-4 h-4" />
//           {t.export}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">{t.totalCleanings}</p>
//               <p className="text-2xl font-semibold mt-2">1,248</p>
//             </div>
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <BarChart3 className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <p className="text-sm text-green-600">+12% from last month</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">{t.avgResponseTime}</p>
//               <p className="text-2xl font-semibold mt-2">2.4h</p>
//             </div>
//             <div className="p-3 bg-green-50 rounded-lg">
//               <TrendingUp className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <p className="text-sm text-green-600">-0.5h from last month</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">{t.efficiencyRate}</p>
//               <p className="text-2xl font-semibold mt-2">94%</p>
//             </div>
//             <div className="p-3 bg-yellow-50 rounded-lg">
//               <PieChart className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <p className="text-sm text-green-600">+3% from last month</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">{t.alertsGenerated}</p>
//               <p className="text-2xl font-semibold mt-2">89</p>
//             </div>
//             <div className="p-3 bg-red-50 rounded-lg">
//               <BarChart3 className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <p className="text-sm text-red-600">-5 from last month</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">{t.monthlyReport}</h2>
//             <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
//               <Download className="w-4 h-4" />
//               {t.download}
//             </button>
//           </div>
//           <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//               <p className="text-gray-500">{t.comingSoon}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">{t.binStatus}</h2>
//             <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
//               <Download className="w-4 h-4" />
//               {t.download}
//             </button>
//           </div>
//           <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//               <p className="text-gray-500">{t.comingSoon}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




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