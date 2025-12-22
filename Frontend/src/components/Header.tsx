// // import { Languages, AlertCircle } from 'lucide-react';
// // import { subcities } from '../data/mockData';

// // interface HeaderProps {
// //   language: 'en' | 'am';
// //   setLanguage: (lang: 'en' | 'am') => void;
// //   selectedSubcity: string;
// //   setSelectedSubcity: (subcity: string) => void;
// // }

// // const translations = {
// //   en: {
// //     title: 'Addis Ababa Solid Waste Monitoring System',
// //     subtitle: 'Real-time Drainage Protection & Flood Prevention',
// //     selectSubcity: 'All Subcities',
// //   },
// //   am: {
// //     title: 'የአዲስ አበባ ጠንካራ ቆሻሻ ክትትል ስርዓት',
// //     subtitle: 'የቆሻሻ ውሃ መውረጃ ጥበቃ እና የጎርፍ መከላከያ',
// //     selectSubcity: 'ሁሉም ክፍለ ከተማዎች',
// //   }
// // };

// // export function Header({ language, setLanguage, selectedSubcity, setSelectedSubcity }: HeaderProps) {
// //   const t = translations[language];

// //   return (
// //     <header className="bg-white border-b border-gray-200 shadow-sm">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="flex items-center gap-2">
// //               <div className="w-3 h-8 bg-green-600"></div>
// //               <div className="w-3 h-8 bg-yellow-400"></div>
// //               <div className="w-3 h-8 bg-red-600"></div>
// //             </div>
// //             <div>
// //               <h1 className="text-blue-900">{t.title}</h1>
// //               <p className="text-gray-600 text-sm mt-1">{t.subtitle}</p>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-4">
// //             <select
// //               value={selectedSubcity}
// //               onChange={(e) => setSelectedSubcity(e.target.value)}
// //               className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             >
// //               <option value="all">{t.selectSubcity}</option>
// //               {subcities.map((subcity) => (
// //                 <option key={subcity.en} value={subcity.en}>
// //                   {language === 'en' ? subcity.en : subcity.am}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
// //               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //             >
// //               <Languages className="w-4 h-4" />
// //               <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }


// import { Languages, Bell, User } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// interface HeaderProps {
//   language: 'en' | 'am';
//   setLanguage: (lang: 'en' | 'am') => void;
//   onToggleSidebar?: () => void;
// }

// const translations = {
//   en: {
//     title: 'Addis Ababa Waste Management System',
//     notifications: 'Notifications',
//     profile: 'Profile',
//   },
//   am: {
//     title: 'የአዲስ አበባ ቆሻሻ አስተዳደር ስርዓት',
//     notifications: 'ማሳወቂያዎች',
//     profile: 'መገለጫ',
//   },
// };

// export function Header({ language, setLanguage, onToggleSidebar }: HeaderProps) {
//   const { user } = useAuth();
//   const t = translations[language];

//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {onToggleSidebar && (
//             <button
//               onClick={onToggleSidebar}
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           )}
          
//           <div>
//             <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
//             <p className="text-sm text-gray-600">
//               {language === 'en' ? 'Administrator Dashboard' : 'የአስተዳዳሪ ዳሽቦርድ'}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="relative p-2 rounded-lg hover:bg-gray-100">
//             <Bell className="w-5 h-5 text-gray-600" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>

//           <button
//             onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Languages className="w-4 h-4" />
//             <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
//           </button>

//           <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
//             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//               <User className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
//               <p className="text-xs text-gray-500">Admin</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



import { Languages, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './components.css';

interface HeaderProps {
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
}

const translations = {
  en: {
    title: 'Addis Ababa Waste Management System',
    subtitle: 'Administrator Dashboard',
  },
  am: {
    title: 'የአዲስ አበባ ቆሻሻ አስተዳደር ስርዓት',
    subtitle: 'የአስተዳዳሪ ዳሽቦርድ',
  },
};

export function Header({ language, setLanguage }: HeaderProps) {
  const { user } = useAuth();
  const t = translations[language];

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{t.title}</h1>
        <p className="header-subtitle">{t.subtitle}</p>
      </div>

      <div className="header-right">
      
        <button
          className="language-button"
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
        >
          <Languages className="icon-small" />
          <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
        </button>

        <div className="user-section">
          <div className="user-avatar">
            <User className="icon" />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.full_name}</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
