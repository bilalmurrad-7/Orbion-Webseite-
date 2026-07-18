import React, { useState, useRef } from 'react';

function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition wird nicht unterstützt. Bitte nutze Chrome, Edge oder Safari.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'de-DE';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognitionRef.current.onresult = (event) => {
      const last = event.results.length - 1;
      setTranscript(event.results[last][0].transcript);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-3 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-500/20 border border-red-500/40 text-red-400'
            : 'glass-card hover:bg-green-500/10'
        }`}
        title="Mikrofon aktivieren"
      >
        🎤
      </button>
      {transcript && (
        <div className="text-sm text-gray-400 max-w-48 truncate">
          {transcript}
        </div>
      )}
    </div>
  );
}

export default VoiceInput;
