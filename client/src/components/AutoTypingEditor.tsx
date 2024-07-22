import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const longCodeSample = `
function generateCode() {
 
  const code = \`
    function greet(name) {
      console.log('Hello, ' + name);
    }

    greet('World');
   
    for (let i = 0; i < 100; i++) {
      console.log('Line ' + i);
    }

    const data = [1, 2, 3, 4, 5];
    data.forEach((item) => {
      console.log(item * 2);
    });

   
  \`;
  return code;
}

const codeSample = generateCode();
console.log(codeSample);
`;

const AutoTypingEditor: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [cursorPos, setCursorPos] = useState<number>(0);

    useEffect(() => {
        const typingInterval = 50; // Speed of typing in milliseconds
        const loopDelay = 1000; // Delay before starting the loop again

        const typeCode = () => {
            if (cursorPos < longCodeSample.length) {
                setCode((prev) => prev + longCodeSample[cursorPos]);
                setCursorPos((prev) => prev + 1);
            } else {
                // Reset cursor position and code after typing is complete
                setTimeout(() => {
                    setCode('');
                    setCursorPos(0);
                }, loopDelay);
            }
        };

        const timer = setInterval(typeCode, typingInterval);

        return () => clearInterval(timer);
    }, [cursorPos]);

    return (
        <div className="w-full h-full w-full rounded-lg shadow-lg overflow-hidden  ">
            <Editor
                width={"100%"}
                className='rounded-lg'
                height="100%"
                language="javascript"
                value={code}
                theme="vs-dark"
                options={{ readOnly: true }} // Make the editor read-only to prevent user edits
            />
        </div>
    );
};

export default AutoTypingEditor;
