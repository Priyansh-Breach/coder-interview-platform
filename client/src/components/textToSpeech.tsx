import { Volume2Icon } from "lucide-react";
import React, { useState, useEffect } from "react";

interface ITTS {
  text: string;
}

const TextToSpeech: React.FC<ITTS> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1.2); // Default rate is 1

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

    // Populate voices list
    updateVoices();
    // Update voices list when it changes
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSpeak = () => {
    console.log(text);
    if (!selectedVoice) {
      alert("No voice selected.");
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
    <div >
      <button className="border cursor-pointer  w-fit p-2 rounded  mx-2 " onClick={handleSpeak} disabled={isSpeaking}>
        {isSpeaking ? (
          "Speaking..."
        ) : (
          <>
            <Volume2Icon className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default TextToSpeech;
