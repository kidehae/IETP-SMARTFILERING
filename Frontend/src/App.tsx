import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { BinLocations}   from './pages/BinLocations';
import { CleaningHistory } from './pages/CleaningHistory';
import { Reports } from './pages/Reports';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SensorProvider } from './contexts/SensorContext';

function ProtectedLayout() {
  // const [language, setLanguage] = useState<'am' | 'en'>('am');
  const [language, setLanguage] = useState<'am' | 'en'>('en');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login"  />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        language={language}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />
      
      <div className="flex-1 overflow-auto">
        <Header 
          language={language}
          setLanguage={setLanguage}
        />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard language={language} />} />
            <Route path="/employees" element={<Employees language={language} />} />
            <Route path="/bins" element={<BinLocations language={language} />} />
            <Route path="/cleaning" element={<CleaningHistory language={language} />} />
            <Route path="/reports" element={<Reports language={language} />} />
           
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SensorProvider>
          <Routes>
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </SensorProvider>
      </AuthProvider>
    </Router>
  );
}

function LoginWrapper() {
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Login language={language} />;
}

export default App;