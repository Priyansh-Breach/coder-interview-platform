import { Volume2Icon } from "lucide-react";
import React, { useState, useEffect } from "react";

interface ITTS {
  textChunk: string; // Single chunk of text received
  loading: boolean; // Loading state to determine when chunks stop coming
}

const TextToSpeech: React.FC<ITTS> = ({ textChunk, loading }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isShutUp, setIsShutUp] = useState(false); // "Shutup" mode state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1.2); // Default rate is 1.2
  const [spokenChunks, setSpokenChunks] = useState<string[]>([]); // Array of already spoken chunks
  const [queuedChunks, setQueuedChunks] = useState<string[]>([]); // Queue of new chunks to speak

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    const updateVoices = () => {
      const voiceList = window.speechSynthesis.getVoices();
      setVoices(voiceList);

      const voice =
        voices.find((v) => v.name === "Microsoft Ravi - English (India)") ||
        voiceList[0];
      setSelectedVoice(voice);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Whenever a new chunk of text arrives, add it to queuedChunks
  useEffect(() => {
    if (textChunk && !isShutUp) {
      setQueuedChunks((prev) => [...prev, textChunk]); // Add new chunk to the queue
    }
  }, [textChunk, isShutUp]);

  // Automatically speak when loading becomes false and new chunk is available
  useEffect(() => {
    if (!loading && queuedChunks.length > 0 && !isSpeaking && !isShutUp) {
      handleSpeak(); // Automatically speak the next chunk when ready
    }
  }, [loading, queuedChunks, isSpeaking, isShutUp]);

  const handleSpeak = () => {
    if (!selectedVoice || queuedChunks.length === 0) {
      return;
    }

    const currentChunk = queuedChunks[0]; // Get the first chunk in the queue
    const utterance = new SpeechSynthesisUtterance(currentChunk);
    utterance.voice = selectedVoice;
    utterance.rate = rate; // Set the speech rate

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpokenChunks((prev) => [...prev, currentChunk]); // Move the spoken chunk to spokenChunks
      setQueuedChunks((prev) => prev.slice(1)); // Remove the chunk from the queue after speaking
    };

    window.speechSynthesis.speak(utterance);
  };

  // Function to stop speaking
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setQueuedChunks([]); // Clear the queued chunks if stopped
  };

  // Toggle shutup mode
  const toggleShutUp = () => {
    setIsShutUp((prev) => !prev);
    if (!isShutUp) {
      handleStop(); // Stop speaking immediately if "shutup" is activated
    }
  };

  return (
    <div>
      <button
        className="border cursor-pointer w-fit p-2 rounded mx-2"
        onClick={handleSpeak}
        disabled={isSpeaking || isShutUp || queuedChunks.length === 0}
      >
        Speak
      </button>
      <button
        className="border cursor-pointer w-fit p-2 rounded mx-2"
        onClick={toggleShutUp}
      >
        {isShutUp ? "Resume" : "Shutup"}
      </button>
      <button
        className="border cursor-pointer w-fit p-2 rounded mx-2"
        onClick={handleStop}
      >
        Stop
      </button>
      <div>{isSpeaking ? "Speaking..." : "Idle"}</div>
    </div>
  );
};

export default TextToSpeech;
