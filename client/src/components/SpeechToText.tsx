import React, { useState, useEffect, useRef } from 'react';
import TextToSpeech from './textToSpeech';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;

const colors = [
    'aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan',
    'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender',
    'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink',
    'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato',
    'turquoise', 'violet', 'white', 'yellow'
];

const SpeechToText: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            alert('Speech Recognition API is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        if (SpeechGrammarList) {
            const speechRecognitionList = new SpeechGrammarList();
            const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
        }

        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            const color = event.results[0][0].transcript;
            setTranscript('Result received: ' + color);
            document.documentElement.style.backgroundColor = color;
            console.log('Confidence: ' + event.results[0][0].confidence);
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onnomatch = () => {
            setTranscript("I didn't recognise that color.");
        };

        recognition.onerror = (event: any) => {
            setTranscript('Error occurred in recognition: ' + event.error);
        };

    }, []);

    const handleStartStop = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    return (
        <div>
            <button onClick={handleStartStop}>
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <p className="output">{transcript}</p>
            <p className="hints">
                Tap/click then say a color to change the background color of the app. Try {
                    colors.map((color, index) => (
                        <span key={index} style={{ backgroundColor: color }}> {color} </span>
                    ))
                }.
            </p>
            <TextToSpeech />
        </div>
    );
};

export default SpeechToText;
