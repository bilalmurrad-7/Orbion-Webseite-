import React, { useState, useEffect } from 'react';

function Clients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', type: '', contact: '', status: 'New' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('clients');
    if (stored) {
      setClients(JSON.parse(stored));
    }
  }, []);

  const handleAddClient = () => {
    if (newClient.name && newClient.type && newClient.contact) {
      const client = { ...newClient, id: Date.now() };
      const updated = [...clients, client];
      setClients(updated);
      localStorage.setItem('clients', JSON.stringify(updated));
      setNewClient({ name: '', type: '', contact: '', status: 'New' });
      setIsAdding(false);
    }
  };

  const handleUpdateClient = (id, updates) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c);
    setClients(updated);
    localStorage.setItem('clients', JSON.stringify(updated));
  };

  const handleRemoveClient = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    localStorage.setItem('clients', JSON.stringify(updated));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'text-green-400';
      case 'Verhandlung': return 'text-yellow-400';
      case 'Abgelehnt': return 'text-red-400';
      case 'Neu': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Gesamt Kunden</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{clients.length}</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Aktiv</div>
          <div className="text-3xl font-bold text-green-400 mt-2">
            {clients.filter(c => c.status === 'Aktiv').length}
          </div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">In Verhandlung</div>
          <div className="text-3xl font-bold text-yellow-400 mt-2">
            {clients.filter(c => c.status === 'Verhandlung').length}
          </div>
        </div>
      </div>

      {/* Add Client Form */}
      {isAdding && (
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">Neuer Kunde</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Kundenname"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Unternehmenstyp"
              value={newClient.type}
              onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Kontakt (Email/Telefon)"
              value={newClient.contact}
              onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
            />
            <select
              value={newClient.status}
              onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="Neu">Neu</option>
              <option value="Verhandlung">Verhandlung</option>
              <option value="Aktiv">Aktiv</option>
              <option value="Abgelehnt">Abgelehnt</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAddClient} className="glass-button flex-1">
                Hinzufügen
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="glass-button w-full">
          + Kunde hinzufügen
        </button>
      )}

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.length === 0 ? (
          <div className="glass-card md:col-span-2">
            <p className="text-gray-400">Keine Kunden hinzugefügt</p>
          </div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="glass-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{client.type}</p>
                </div>
                <button
                  onClick={() => handleRemoveClient(client.id)}
                  className="text-red-400 hover:bg-red-500/10 p-2 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Kontakt</label>
                  <p className="text-white mt-1">{client.contact}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <select
                    value={client.status}
                    onChange={(e) => handleUpdateClient(client.id, { status: e.target.value })}
                    className={`w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 ${getStatusColor(client.status)}`}
                  >
                    <option value="Neu">Neu</option>
                    <option value="Verhandlung">Verhandlung</option>
                    <option value="Aktiv">Aktiv</option>
                    <option value="Abgelehnt">Abgelehnt</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Clients;
