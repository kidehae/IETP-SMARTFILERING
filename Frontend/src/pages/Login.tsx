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