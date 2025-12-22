// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Lock, User, AlertCircle } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import "./pages.css";

// interface LoginProps {
//   language: 'en' | 'am';
// }

// const translations = {
//   en: {
//     title: 'Admin Login',
//     username: 'Username',
//     password: 'Password',
//     login: 'Login',
//     loading: 'Logging in...',
//     error: 'Invalid username or password',
//     systemName: 'AASTU Waste Management System',
//     welcome: 'Welcome Back',
//   },
//   am: {
//     title: 'የአስተዳዳሪ መግቢያ',
//     username: 'የተጠቃሚ ስም',
//     password: 'የይለፍ ቃል',
//     login: 'ግባ',
//     loading: 'በመግባት ላይ...',
//     error: 'የተጠቃሚ ስም ወይም የይለፍ ቃል የተሳሳተ ነው',
//     systemName: 'አአስቱ ቆሻሻ አስተዳደር ስርዓት',
//     welcome: 'እንኳን ደህና መጡ',
//   },
// };

// export function Login({ language }: LoginProps) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const success = await login(username, password);
    
//     if (success) {
//       navigate('/');
//     } else {
//       setError(t.error);
//     }
    
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
//               <Lock className="w-6 h-6 text-white" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.systemName}</h1>
//           <p className="text-gray-600">{t.welcome}</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {t.username}
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <User className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {t.password}
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <Lock className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? t.loading : t.login}
//             </button>
//           </form>
//         </div>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-500">
//             {language === 'en' 
//               ? 'For demo use: admin / admin123'
//               : 'ለማሳያ ያገለግሉ: admin / admin123'
//             }
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import "./pages.css";

interface LoginProps {
  language: 'en' | 'am';
}

const translations = {
  en: {
    title: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    loading: 'Logging in...',
    error: 'Invalid username or password',
    systemName: 'Addis Ababa Waste Management System',
    welcome: 'Welcome Back',
  },
  am: {
    title: 'የአስተዳዳሪ መግቢያ',
    username: 'የተጠቃሚ ስም',
    password: 'የይለፍ ቃል',
    login: 'ግባ',
    loading: 'በመግባት ላይ...',
    error: 'የተጠቃሚ ስም ወይም የይለፍ ቃል የተሳሳተ ነው',
    systemName: 'አዲስ አበባ ቆሻሻ አስተዳደር ስርዓት',
    welcome: 'እንኳን ደህና መጡ',
  },
};

export function Login({ language }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = translations["en"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError(t.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo-container">
            <div className="login-logo">
              <Lock className="login-logo-icon" />
            </div>
          </div>
          <h1 className="login-system-name">{t.systemName}</h1>
          <p className="login-welcome">{t.welcome}</p>
        </div>

        <div className="login-card">
          <div className="login-title">
            <h2>{t.title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <AlertCircle className="error-icon" />
                <p className="login-error-message">{error}</p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {t.username}
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <User className="icon" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  required
                  disabled={loading}
                  placeholder={language === 'en' ? 'Enter your username' : 'የተጠቃሚ ስምዎን ያስገቡ'}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.password}
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Lock className="icon" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                  disabled={loading}
                  placeholder={language === 'en' ? 'Enter your password' : 'የይለፍ ቃልዎን ያስገቡ'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <span className="login-loading">
                  <span className="spinner"></span>
                  {t.loading}
                </span>
              ) : (
                t.login
              )}
            </button>
          </form>
        </div>

        <div className="demo-credentials">
          <p className="demo-text">
            {language === 'en' 
              ? 'For demo use: admin / admin123'
              : 'ለማሳያ ያገለግሉ: admin / admin123'
            }
          </p>
        </div>
      </div>
    </div>
  );
}