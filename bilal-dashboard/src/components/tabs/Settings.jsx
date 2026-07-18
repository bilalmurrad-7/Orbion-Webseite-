import React, { useState, useEffect } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    primaryColor: '#22c55e',
    language: 'de',
    currency: '€',
    timezone: 'Europe/Berlin',
    ttsVoice: 'female',
    ttsSpeed: 1,
    ttsVolume: 1,
    apiKey: '',
  });
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('dashboard_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
  }, []);

  const handleColorChange = (newColor) => {
    const updated = { ...settings, primaryColor: newColor };
    setSettings(updated);
    localStorage.setItem('dashboard_settings', JSON.stringify(updated));
    document.documentElement.style.setProperty('--color-primary', newColor);
  };

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('dashboard_settings', JSON.stringify(updated));
  };

  const handleExport = () => {
    const allData = {
      profile: JSON.parse(localStorage.getItem('profile') || '{}'),
      analytics: JSON.parse(localStorage.getItem('analytics_websites') || '[]'),
      finances: {
        income: JSON.parse(localStorage.getItem('finances_income') || '[]'),
        expenses: JSON.parse(localStorage.getItem('finances_expenses') || '[]'),
      },
      projects: JSON.parse(localStorage.getItem('projects') || '[]'),
      clients: JSON.parse(localStorage.getItem('clients') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bilal-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setCopied('export');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.profile) localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.analytics) localStorage.setItem('analytics_websites', JSON.stringify(data.analytics));
        if (data.finances) {
          localStorage.setItem('finances_income', JSON.stringify(data.finances.income || []));
          localStorage.setItem('finances_expenses', JSON.stringify(data.finances.expenses || []));
        }
        if (data.projects) localStorage.setItem('projects', JSON.stringify(data.projects));
        if (data.clients) localStorage.setItem('clients', JSON.stringify(data.clients));
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('dashboard_settings', JSON.stringify(data.settings));
          document.documentElement.style.setProperty('--color-primary', data.settings.primaryColor);
        }
        setCopied('import');
        setTimeout(() => setCopied(''), 2000);
        window.location.reload();
      } catch (error) {
        alert('Fehler beim Importieren: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Color Settings */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">🎨 Dashboard Design</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Primärfarbe</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono"
              />
              <span className="text-gray-400 text-sm">(Live-Änderung)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atlas Voice Settings */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">🎤 Atlas Stimme</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">TTS Stimme</label>
            <select
              value={settings.ttsVoice}
              onChange={(e) => handleSettingChange('ttsVoice', e.target.value)}
              className="w-full mt-2 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="female">Weiblich</option>
              <option value="male">Männlich</option>
              <option value="neutral">Neutral</option>
              <option value="robot">Roboter</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Sprechgeschwindigkeit: {settings.ttsSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.ttsSpeed}
              onChange={(e) => handleSettingChange('ttsSpeed', parseFloat(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Lautstärke: {Math.round(settings.ttsVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.ttsVolume}
              onChange={(e) => handleSettingChange('ttsVolume', parseFloat(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">🌐 Sprache & Region</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Sprache</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full mt-2 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="de">Deutsch 🇩🇪</option>
              <option value="en">English 🇬🇧</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Währung</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full mt-2 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="€">Euro €</option>
              <option value="$">Dollar $</option>
              <option value="£">Pound £</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Zeitzone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full mt-2 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="Europe/Berlin">MEZ (Berlin)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="America/New_York">EST (New York)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claude API Settings */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">🔑 Claude API</h3>
        <p className="text-sm text-gray-400 mb-4">
          Für Atlas AI und erweiterte Features. Hol dir einen Key bei{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
            console.anthropic.com
          </a>
        </p>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Claude API Key"
            value={settings.apiKey}
            onChange={(e) => handleSettingChange('apiKey', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
          />
          <button className="glass-button w-full">
            🧪 API testen
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">💾 Datenverwaltung</h3>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className={`glass-button w-full ${copied === 'export' ? 'bg-green-500/20 border-green-500/40' : ''}`}
          >
            {copied === 'export' ? '✓ Exportiert!' : '📥 Daten exportieren'}
          </button>
          <label className="glass-button w-full cursor-pointer text-center">
            📤 Daten importieren
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={() => {
              if (window.confirm('⚠️ Alle Daten löschen? Das kann nicht rückgängig gemacht werden!')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
          >
            🗑️ Alle Daten löschen
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">ℹ️ Über das Dashboard</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>📱 <strong>Version:</strong> 1.0</p>
          <p>🔒 <strong>Datenschutz:</strong> Alle Daten werden lokal gespeichert</p>
          <p>💾 <strong>Speicher:</strong> Browser LocalStorage</p>
          <p>🌐 <strong>Offline:</strong> Funktioniert ohne Internetverbindung*</p>
          <p className="text-xs text-gray-500 mt-4">
            *Außer Atlas AI und API-Features
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
