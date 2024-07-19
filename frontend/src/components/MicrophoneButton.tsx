// src/components/MicrophoneButton.tsx

import React, { useState } from "react";
import socket from "../socket";

const MicrophoneButton: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            // send audio data to the backend via WebSocket
        } else {
            // Start recording
            setIsRecording(true);
            // initiate audio recording
        }
    };

    return (
        <button onClick={handleRecord}>
            {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
    );
};

export default MicrophoneButton;
