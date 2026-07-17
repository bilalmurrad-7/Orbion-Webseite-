import React, { useState, useEffect } from 'react';

function AtlasAI() {
  const [isReady, setIsReady] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('atlas_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      setApiKey(settings.apiKey || '');
      setIsReady(!!settings.apiKey);
    }
    const chatHistory = localStorage.getItem('atlas_chat');
    if (chatHistory) {
      setChat(JSON.parse(chatHistory));
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !apiKey) return;

    const userMsg = { role: 'user', content: message };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: `Du bist Atlas, Bilals persönlicher KI-Mitarbeiter. Du bist hilfsbereit, intelligent und sprichst Deutsch.
          Deine Aufgaben sind:
          1) Finanz-Tracking und Buchführung
          2) Monatliche Reports schreiben
          3) Automatisierung wo möglich
          4) Natürliche Kommunikation auf Deutsch
          Antworte immer präzise und hilfreich.`,
          messages: newChat.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('API Error: ' + response.statusText);
      }

      const data = await response.json();
      const assistantMsg = {
        role: 'assistant',
        content: data.content[0].text,
      };

      const updatedChat = [...newChat, assistantMsg];
      setChat(updatedChat);
      localStorage.setItem('atlas_chat', JSON.stringify(updatedChat));

      // Text-to-Speech
      speak(assistantMsg.content);
    } catch (error) {
      console.error('Error:', error);
      setChat([...newChat, { role: 'assistant', content: '❌ Fehler: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Atlas Status</h3>
            <div className={`mt-2 flex items-center gap-2 ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
              <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
              <span>{isReady ? '✓ Atlas bereit' : '⏳ Einrichtung erforderlich'}</span>
            </div>
          </div>
          <div className="text-4xl">🤖</div>
        </div>
      </div>

      {!isReady ? (
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">Claude API-Key erforderlich</h3>
          <p className="text-gray-400 mb-4">
            Bitte gib deinen Claude API-Key ein, damit Atlas funktioniert. Du kannst ihn hier erstellen:{' '}
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              console.anthropic.com
            </a>
          </p>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Claude API-Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
            />
            <button
              onClick={() => {
                if (apiKey) {
                  localStorage.setItem('atlas_settings', JSON.stringify({ apiKey }));
                  setIsReady(true);
                }
              }}
              className="glass-button w-full"
            >
              Speichern & Aktivieren
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card flex flex-col h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Chat mit Atlas</h3>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chat.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Starte ein Gespräch mit Atlas!</p>
            ) : (
              chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-green-500/20 border border-green-500/40 text-green-100'
                        : 'bg-white/10 border border-white/20 text-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-2 rounded-lg text-gray-400">
                  Atlas denkt nach...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nachricht eingeben..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="glass-button disabled:opacity-50"
            >
              📤
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-2">Über Atlas</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>✓ Persönlicher KI-Mitarbeiter</li>
          <li>✓ Deutschsprachig</li>
          <li>✓ Chat-Verlauf speichern</li>
          <li>✓ Text-zu-Sprache Antworten</li>
          <li>✓ Finanz-Tracking Integration</li>
        </ul>
      </div>
    </div>
  );
}

export default AtlasAI;
