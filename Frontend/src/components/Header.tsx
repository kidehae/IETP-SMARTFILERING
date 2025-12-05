import { Languages, AlertCircle } from 'lucide-react';
import { subcities } from '../data/mockData';

interface HeaderProps {
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
  selectedSubcity: string;
  setSelectedSubcity: (subcity: string) => void;
}

const translations = {
  en: {
    title: 'Addis Ababa Solid Waste Monitoring System',
    subtitle: 'Real-time Drainage Protection & Flood Prevention',
    selectSubcity: 'All Subcities',
  },
  am: {
    title: 'የአዲስ አበባ ጠንካራ ቆሻሻ ክትትል ስርዓት',
    subtitle: 'የቆሻሻ ውሃ መውረጃ ጥበቃ እና የጎርፍ መከላከያ',
    selectSubcity: 'ሁሉም ክፍለ ከተማዎች',
  }
};

export function Header({ language, setLanguage, selectedSubcity, setSelectedSubcity }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-8 bg-green-600"></div>
              <div className="w-3 h-8 bg-yellow-400"></div>
              <div className="w-3 h-8 bg-red-600"></div>
            </div>
            <div>
              <h1 className="text-blue-900">{t.title}</h1>
              <p className="text-gray-600 text-sm mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedSubcity}
              onChange={(e) => setSelectedSubcity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t.selectSubcity}</option>
              {subcities.map((subcity) => (
                <option key={subcity.en} value={subcity.en}>
                  {language === 'en' ? subcity.en : subcity.am}
                </option>
              ))}
            </select>

            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
