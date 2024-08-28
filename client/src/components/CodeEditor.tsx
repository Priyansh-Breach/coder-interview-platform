import React, { useEffect, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { getLocalStorageValue } from "@/lib/Utils/getLocalStorage";
import { SelectMore } from "./ui/Icons/SelectMore";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCode, setLanguage } from "@/redux/features/Interview/editorSlice";
import { debounce } from "lodash";

const languages = [
  { label: "C", value: "c" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Ruby", value: "ruby" },
  { label: "Go", value: "go" },
  { label: "Swift", value: "swift" },
  { label: "Rust", value: "rust" },
  { label: "Dart", value: "dart" },
  { label: "Scala", value: "scala" },
  { label: "Perl", value: "perl" },
  { label: "Shell", value: "shell" },
];

const boilerplateCode: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  javascript: `console.log("Hello, World!");`,
  typescript: `console.log("Hello, World!");`,
  python: `print("Hello, World!")`,
  java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
  ruby: `puts 'Hello, World!'`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  swift: `print("Hello, World!")`,
  rust: `fn main() {
    println!("Hello, World!");
}`,
  dart: `void main() {
    print('Hello, World!');
}`,
  scala: `object HelloWorld extends App {
    println("Hello, World!")
}`,
  perl: `print "Hello, World!\\n";`,
  shell: `#!/bin/bash
echo "Hello, World!"`,
};

const MonacoEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.editor.code);
  const language = useAppSelector((state) => state.editor.language);
  const [localCode, setLocalCode] = useState(code);
  const [theme, setTheme] = useState<string | null>("dark");
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = getLocalStorageValue("vite-ui-theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);


  useEffect(() => {
    const initialCode = boilerplateCode[language] || '';
    setLocalCode(initialCode);
    dispatch(setCode(initialCode)); 
  }, [language, dispatch]);

  const autosaveCode = useCallback(
    debounce((code) => {
      dispatch(setCode(code));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    autosaveCode(localCode);
  }, [localCode, autosaveCode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      const lines = value.split("\n");
      if (lines.length > 1000) {
        setWarning(
          "Code exceeds 1000 lines. Only the first 1000 lines will be processed."
        );
        setLocalCode(lines.slice(0, 1000).join("\n"));
      } else {
        setWarning(null);
        setLocalCode(value);
      }
    }
  };

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  return (
    <div className="flex flex-col w-full h-full border shadow-lg overflow-hidden">
      <div className="flex justify-between items-center bg-card">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="m-2 h-7 text-xs">
              {language} <SelectMore />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={language}
              onValueChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <DropdownMenuRadioItem key={lang.value} value={lang.value}>
                  {lang.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {warning && (
          <div className=" w-full text-left text-red-500 text-xs">
            {warning}
          </div>
        )}
      </div>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={localCode}
        language={language}
        onChange={handleEditorChange}
        theme={`vs-${theme}`}
      />
    </div>
  );
};

export default MonacoEditor;
