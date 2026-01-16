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
