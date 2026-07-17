import React, { useState, useEffect } from 'react';

function AboutMe() {
  const [profile, setProfile] = useState({
    name: 'Bilal',
    age: 14,
    birthday: '2010-05-30',
    who: 'Student + Entrepreneur',
    goals: 'Finanziell frei, ohne 08/15 Job',
    interests: 'Anime, Power-Scaling, Tech, Webseitenbau',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(profile);

  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored) {
      const data = JSON.parse(stored);
      setProfile(data);
      setEdited(data);
    }
  }, []);

  const calculateAge = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const getDaysUntilBirthday = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diff = nextBirthday - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleSave = () => {
    setProfile(edited);
    localStorage.setItem('profile', JSON.stringify(edited));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="glass-card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-white">{profile.name}</h2>
            <p className="text-gray-400 mt-1">{profile.who}</p>
          </div>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setEdited(profile);
            }}
            className="glass-button"
          >
            {isEditing ? 'Abbrechen' : '✎ Bearbeiten'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                value={edited.name}
                onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Geburtstag</label>
              <input
                type="date"
                value={edited.birthday}
                onChange={(e) => setEdited({ ...edited, birthday: e.target.value })}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Wer bin ich?</label>
              <input
                type="text"
                value={edited.who}
                onChange={(e) => setEdited({ ...edited, who: e.target.value })}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Ziele</label>
              <textarea
                value={edited.goals}
                onChange={(e) => setEdited({ ...edited, goals: e.target.value })}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                rows="3"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Interessen</label>
              <textarea
                value={edited.interests}
                onChange={(e) => setEdited({ ...edited, interests: e.target.value })}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                rows="3"
              />
            </div>
            <button onClick={handleSave} className="glass-button w-full">
              Speichern
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Alter</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{calculateAge(profile.birthday)} Jahre</p>
              <p className="text-xs text-gray-500 mt-1">
                🎂 Geburtstag in {getDaysUntilBirthday(profile.birthday)} Tagen
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Geburtstag</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {new Date(profile.birthday).toLocaleDateString('de-DE', { month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">Ziele</p>
              <p className="text-white mt-2">{profile.goals}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">Interessen</p>
              <p className="text-white mt-2">{profile.interests}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutMe;
