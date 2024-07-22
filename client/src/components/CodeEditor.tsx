import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';
import { getLocalStorageValue } from '@/lib/Utils/getLocalStorage';
import { SelectMore } from './ui/Icons/SelectMore';

const languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    // Add more languages as needed
];

const MonacoEditor: React.FC = () => {
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState<string | null>("dark");

    useEffect(() => {
      const storedTheme = getLocalStorageValue('vite-ui-theme');
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }, []);
    
    const handleEditorChange = (value: string | undefined) => {
        console.log(value);
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    return (
        <div className="flex flex-col w-full h-full rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center border bg-card">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className='m-2 h-7 text-xs' >{language} <SelectMore /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                            {languages.map((lang) => (
                                <>
                                    <DropdownMenuRadioItem key={lang.value} value={lang.value}>{lang.label}</DropdownMenuRadioItem>
                                </>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value="// Write your code here"
                language={language}
                onChange={handleEditorChange}
                theme={`vs-${theme}`}
            />
        </div>
    );
};

export default MonacoEditor;
