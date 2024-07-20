import React, { useState, useEffect } from 'react';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.1); // Default rate is 1

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    const updateVoices = () => {
      const voiceList = window.speechSynthesis.getVoices();
      setVoices(voiceList);
      if (voiceList.length > 0) {
        setSelectedVoice(voiceList[0]); // Default to the first available voice
      }
    };

    // Populate voices list
    updateVoices();
    // Update voices list when it changes
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = voices.find(v => v.name === event.target.value) || null;
    setSelectedVoice(voice);
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(event.target.value));
  };

  const handleSpeak = () => {
    if (!selectedVoice) {
      alert('No voice selected.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate; // Set the speech rate

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleChange}
        rows={5}
        cols={40}
        placeholder="Enter text here..."
      />
      <div>
        <label htmlFor="voice-select">Select Voice:</label>
        <select
          id="voice-select"
          onChange={handleVoiceChange}
          value={selectedVoice?.name || ''}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="rate">Speech Rate:</label>
        <input
          id="rate"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={rate}
          onChange={handleRateChange}
        />
        <span>{rate.toFixed(1)}</span> {/* Display the current rate */}
      </div>
      <button onClick={handleSpeak} disabled={isSpeaking}>
        {isSpeaking ? 'Speaking...' : 'Speak'}
      </button>
    </div>
  );
};

export default TextToSpeech;
