import { AlertTriangle, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface StatusSummaryProps {
  language: 'en' | 'am';
  totalBins: number;
  criticalCount: number;
  warningCount: number;
  safeCount: number;
}

const translations = {
  en: {
    totalBins: 'Total Monitoring Points',
    critical: 'Critical Alerts',
    warning: 'Warning Level',
    safe: 'Safe Status',
    criticalDesc: 'Requires immediate attention',
    warningDesc: 'Schedule cleaning soon',
    safeDesc: 'Operating normally',
  },
  am: {
    totalBins: 'አጠቃላይ የክትትል ነጥቦች',
    critical: 'አስቸኳይ ማንቂያዎች',
    warning: 'የማስጠንቀቂያ ደረጃ',
    safe: 'ደህንነቱ የተጠበቀ',
    criticalDesc: 'ወዲያውኑ ትኩረት ያስፈልጋል',
    warningDesc: 'በቅርብ ጊዜ ማፅዳት ያስፈልጋል',
    safeDesc: 'በመደበኛነት እየሰራ ነው',
  }
};

export function StatusSummary({ language, totalBins, criticalCount, warningCount, safeCount }: StatusSummaryProps) {
  const t = translations[language];

  const stats = [
    {
      label: t.totalBins,
      value: totalBins,
      icon: Trash2,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-600',
      description: '',
    },
    {
      label: t.critical,
      value: criticalCount,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-600',
      bgColor: 'bg-red-600',
      description: t.criticalDesc,
    },
    {
      label: t.warning,
      value: warningCount,
      icon: AlertTriangle,
      color: 'bg-yellow-50 text-yellow-600',
      bgColor: 'bg-yellow-500',
      description: t.warningDesc,
    },
    {
      label: t.safe,
      value: safeCount,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-600',
      description: t.safeDesc,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-gray-900 mt-2">{stat.value}</p>
              {stat.description && (
                <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
              )}
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
