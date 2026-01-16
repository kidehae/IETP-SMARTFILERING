import {
  Home,
  Users,
  Trash2,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './components.css';

interface SidebarProps {
  language: 'en' | 'am';
  isCollapsed: boolean;
  onToggle: () => void;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    employees: 'Employees',
    bins: 'Bin Locations',
    cleaning: 'Cleaning History',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome',
  },
  am: {
    dashboard: 'ዳሽቦርድ',
    employees: 'ሰራተኞች',
    bins: 'የቆሻሻ መጣሪያ ቦታዎች',
    cleaning: 'የማፅዳት ታሪክ',
    reports: 'ሪፖርቶች',
    settings: 'ቅንብሮች',
    logout: 'ውጣ',
    welcome: 'እንኳን ደህና መጡ',
  },
};

const menuItems = [
  { path: '/', icon: Home, labelKey: 'dashboard' },
  { path: '/employees', icon: Users, labelKey: 'employees' },
  { path: '/bins', icon: Trash2, labelKey: 'bins' },
  { path: '/cleaning', icon: Clock, labelKey: 'cleaning' },
  { path: '/reports', icon: BarChart3, labelKey: 'reports' },
  
];

export function Sidebar({ language, isCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ===== Header ===== */}
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <Menu size={22} /> : <X size={22} />}
         
        </button>

        {!isCollapsed && (
          <>
            <h1 className="sidebar-title">
              Addis Ababa Waste Management
            </h1>
            <p className="sidebar-welcome">
              {t.welcome},{' '}
              <span className="username">{user?.username}</span>
            </p>
          </>
        )}
      </div>

      {/* ===== Navigation ===== */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-menu-item ${
                isActive ? 'sidebar-menu-item-active' : ''
              }`}
            >
              <div className="menu-item-icon">
                <Icon className="menu-icon" />
              </div>

              {!isCollapsed && (
                <span className="menu-item-label">
                  {t[item.labelKey as keyof typeof t]}
                </span>
              )}

              {isActive && !isCollapsed && (
                <div className="active-indicator" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ===== Footer ===== */}
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-button">
          <div className="logout-icon">
            <LogOut className="logout-icon-svg" />
          </div>
          {!isCollapsed && (
            <span className="logout-text">{t.logout}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
