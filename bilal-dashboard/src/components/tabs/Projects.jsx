import React, { useState, useEffect } from 'react';

function Projects() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'DGS-App', status: 'In Progress', progress: 65, earnings: 0 },
    { id: 2, name: 'Kaltblut', status: 'In Progress', progress: 40, earnings: 150 },
    { id: 3, name: 'RouteVibe', status: 'Planning', progress: 15, earnings: 0 },
  ]);
  const [newProject, setNewProject] = useState({ name: '', status: 'Planning', progress: 0, earnings: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  const handleAddProject = () => {
    if (newProject.name) {
      const project = { ...newProject, id: Date.now() };
      const updated = [...projects, project];
      setProjects(updated);
      localStorage.setItem('projects', JSON.stringify(updated));
      setNewProject({ name: '', status: 'Planning', progress: 0, earnings: 0 });
      setIsAdding(false);
    }
  };

  const handleUpdateProject = (id, updates) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...updates } : p);
    setProjects(updated);
    localStorage.setItem('projects', JSON.stringify(updated));
  };

  const handleRemoveProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('projects', JSON.stringify(updated));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-400';
      case 'In Progress': return 'text-blue-400';
      case 'Planning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const totalEarnings = projects.reduce((sum, p) => sum + p.earnings, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Anzahl Projekte</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{projects.length}</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Gesamt Verdienst</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{totalEarnings}€</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Durchschnittl. Progress</div>
          <div className="text-3xl font-bold text-blue-400 mt-2">
            {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%
          </div>
        </div>
      </div>

      {/* Add Project Form */}
      {isAdding && (
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">Neues Projekt</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Projektname"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
            />
            <select
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAddProject} className="glass-button flex-1">
                Erstellen
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
          + Projekt hinzufügen
        </button>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="glass-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className={`text-sm mt-1 ${getStatusColor(project.status)}`}>{project.status}</p>
              </div>
              <button
                onClick={() => handleRemoveProject(project.id)}
                className="text-red-400 hover:bg-red-500/10 p-2 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Fortschritt</span>
                  <span className="text-green-400 font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded h-2">
                  <div
                    className="bg-green-500 h-full rounded transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Verdienst (€)</label>
                <input
                  type="number"
                  value={project.earnings}
                  onChange={(e) => handleUpdateProject(project.id, { earnings: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => handleUpdateProject(project.id, { progress: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
