import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import "./CodingArea.css";

const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    // Add more languages as needed
];

const CodingArea: React.FC = () => {
    const [code, setCode] = useState("// Write your code here...");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [question, setQuestion] = useState("Given a string s, find the length of the longest substring without repeating characters.");

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    const handleCompileCode = async () => {
        try {
            const response = await axios.post("http://localhost:3000/code/compile", { code, language });
            setOutput(response.data.output);
        } catch (error) {
            console.error("Error compiling code:", error);
            setOutput(`Error compiling code: ${error}`);
        }
    };

    const handleConversation = async () => {
        try {
            const response = await axios.post("http://localhost:3000/interview", { question, code, language });
            setOutput(response.data.output);
        } catch (error) {
            console.error("Error compiling code:", error);
            setOutput(`Error compiling code: ${error}`);
        }
    };

    return (
        <div className="coding-area-container">
            <div className="header">
                <h1>Longest Substring Without Repeating Characters</h1>
                <p>{question}</p>
                <div className="examples">
                    <div className="example">
                        <h3>Example 1:</h3>
                        <p>Input: s = "abcabcbb"</p>
                        <p>Output: 3</p>
                        <p>Explanation: The answer is "abc", with the length of 3.</p>
                    </div>
                    <div className="example">
                        <h3>Example 2:</h3>
                        <p>Input: s = "bbbbb"</p>
                        <p>Output: 1</p>
                        <p>Explanation: The answer is "b", with the length of 1.</p>
                    </div>
                    <div className="example">
                        <h3>Example 3:</h3>
                        <p>Input: s = "pwwkew"</p>
                        <p>Output: 3</p>
                        <p>Explanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.</p>
                    </div>
                </div>
            </div>
            <div className="editor-container">
                <div className="language-selector">
                    <label htmlFor="language">Select Language: </label>
                    <select id="language" value={language} onChange={handleLanguageChange}>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Editor
                    height="400px"
                    language={language}
                    value={code}
                    onChange={handleCodeChange}
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                    }}
                />
                <button onClick={handleCompileCode} className="compile-button">Compile Code</button>
                <button onClick={handleConversation} className="compile-button">Converse</button>
                <div className="output">
                    <h3>Output:</h3>
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default CodingArea;
