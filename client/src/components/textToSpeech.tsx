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
  const [spokenText, setSpokenText] = useState(""); // Text that has already been spoken
  const [queuedText, setQueuedText] = useState(""); // Text that is queued to be spoken (chunks)

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

  // Whenever a new chunk of text arrives, append it to queuedText
  useEffect(() => {
    if (textChunk && !isShutUp) {
      setQueuedText((prev) => prev + " " + textChunk); // Add new chunk to queue
    }
  }, [textChunk, isShutUp]);

  // Automatically speak when loading becomes false
  useEffect(() => {
    if (!loading && queuedText && !isSpeaking && !isShutUp) {
      handleSpeak(); // Automatically speak when loading completes
    }
  }, [loading, queuedText, isSpeaking, isShutUp]);

  const handleSpeak = () => {
    if (!selectedVoice || !queuedText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(queuedText);
    utterance.voice = selectedVoice;
    utterance.rate = rate; // Set the speech rate

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpokenText((prev) => prev + queuedText); // Append spoken text to spokenText state
      setQueuedText(""); // Clear the queued text after speaking
    };

    window.speechSynthesis.speak(utterance);
  };

  // Function to stop speaking
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setQueuedText(""); // Clear queued text if stopped
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
        disabled={isSpeaking || isShutUp || !queuedText}
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
