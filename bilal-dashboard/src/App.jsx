import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Analytics from './components/tabs/Analytics';
import Finances from './components/tabs/Finances';
import AboutMe from './components/tabs/AboutMe';
import Projects from './components/tabs/Projects';
import Clients from './components/tabs/Clients';
import AtlasAI from './components/tabs/AtlasAI';
import Settings from './components/tabs/Settings';
import VoiceInput from './components/VoiceInput';
import AmbientBackground from './components/AmbientBackground';

const TAB_COMPONENTS = {
  analytics: Analytics,
  finances: Finances,
  aboutMe: AboutMe,
  projects: Projects,
  clients: Clients,
  atlas: AtlasAI,
  settings: Settings,
};

const TABS = [
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'finances', label: 'Finanzen', icon: '💰' },
  { id: 'aboutMe', label: 'Über mich', icon: '👤' },
  { id: 'projects', label: 'Projekte', icon: '🚀' },
  { id: 'clients', label: 'Kunden', icon: '🤝' },
  { id: 'atlas', label: 'Atlas KI', icon: '🤖' },
];

function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex w-full h-full bg-gradient-to-br from-[#0f0f0f] to-[#1a1a2e]">
      <AmbientBackground />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={TABS}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="glass-card border-b border-white/10 rounded-none p-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                ☰
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">
              {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <VoiceInput />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
