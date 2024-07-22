import React, { useEffect, useState } from "react";
import socket from "../socket"; // Import the socket instance
import CodingArea from "../components/CodingArea"; // Ensure this import is correct

const InterviewPage: React.FC = () => {
    const [aiResponse, setAiResponse] = useState<string>("");

    useEffect(() => {
        socket.on("aiResponse", (response: string) => {
            setAiResponse(response);
        });

        return () => {
            socket.off("aiResponse");
        };
    }, []);

    return (
        <div>
            <h1>Interview Page</h1>
            <CodingArea />
            <div>
                <h2>AI Response</h2>
                <pre>{aiResponse}</pre>
            </div>
        </div>
    );
};

export default InterviewPage;