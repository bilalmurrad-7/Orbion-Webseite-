import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const [websites, setWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '', visits: '' });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadWebsites();
  }, []);

  useEffect(() => {
    generateChartData();
  }, [websites]);

  const loadWebsites = () => {
    const stored = localStorage.getItem('analytics_websites');
    if (stored) {
      setWebsites(JSON.parse(stored));
    }
  };

  const generateChartData = () => {
    const grouped = {};
    websites.forEach((site) => {
      const date = site.date || new Date().toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date] += parseInt(site.visits) || 0;
    });

    const data = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, visits]) => ({
        date: new Date(date).toLocaleDateString('de-DE'),
        visits,
      }));

    setChartData(data);
  };

  const handleAddWebsite = () => {
    if (newWebsite.name && newWebsite.url && newWebsite.visits) {
      const website = {
        ...newWebsite,
        visits: parseInt(newWebsite.visits),
        date: new Date().toISOString().split('T')[0],
      };
      const updated = [...websites, website];
      setWebsites(updated);
      localStorage.setItem('analytics_websites', JSON.stringify(updated));
      setNewWebsite({ name: '', url: '', visits: '' });
    }
  };

  const handleRemoveWebsite = (index) => {
    const updated = websites.filter((_, i) => i !== index);
    setWebsites(updated);
    localStorage.setItem('analytics_websites', JSON.stringify(updated));
  };

  const totalVisits = websites.reduce((sum, w) => sum + w.visits, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Gesamte Besuche</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{totalVisits}</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Anzahl Websites</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{websites.length}</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Durchschnitt</div>
          <div className="text-3xl font-bold text-green-400 mt-2">
            {websites.length > 0 ? Math.round(totalVisits / websites.length) : 0}
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass-card h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Besuche über Zeit</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 15, 15, 0.9)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#22c55e"
                dot={{ fill: '#22c55e' }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add Website Form */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">Website hinzufügen</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Website Name"
            value={newWebsite.name}
            onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <input
            type="url"
            placeholder="URL"
            value={newWebsite.url}
            onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <input
            type="number"
            placeholder="Besuche"
            value={newWebsite.visits}
            onChange={(e) => setNewWebsite({ ...newWebsite, visits: e.target.value })}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <button onClick={handleAddWebsite} className="glass-button">
            Hinzufügen
          </button>
        </div>
      </div>

      {/* Websites List */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">Websites</h3>
        <div className="space-y-2">
          {websites.length === 0 ? (
            <p className="text-gray-400">Keine Websites hinzugefügt</p>
          ) : (
            websites.map((site, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
                <div className="flex-1">
                  <p className="font-medium text-white">{site.name}</p>
                  <p className="text-sm text-gray-400">{site.url}</p>
                  <p className="text-sm text-green-400 mt-1">{site.visits} Besuche</p>
                </div>
                <button
                  onClick={() => handleRemoveWebsite(idx)}
                  className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded transition"
                >
                  Löschen
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
