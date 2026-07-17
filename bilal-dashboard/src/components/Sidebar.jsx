import React from 'react';

function Sidebar({ activeTab, setActiveTab, tabs, open, setOpen, isMobile }) {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`glass-card border-r border-white/10 rounded-none flex flex-col h-full transition-all duration-300 ${
          isMobile
            ? `fixed left-0 top-0 z-40 w-72 ${open ? 'translate-x-0' : '-translate-x-full'}`
            : 'w-72'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Atlas Dashboard
          </h2>
          <p className="text-xs text-gray-400 mt-1">Bilal's Personal Hub</p>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                  : 'text-gray-400 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Separator */}
        <div className="border-t border-white/10 px-4 py-2">
          <button
            onClick={() => handleTabClick('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'settings'
                ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                : 'text-gray-400 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="font-medium">Einstellungen</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
