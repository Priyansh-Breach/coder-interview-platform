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
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  // Add more languages as needed
];

const MonacoEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.editor.code);
  const language = useAppSelector((state) => state.editor.language);
  const [localCode, setLocalCode] = useState(code);
  const [theme, setTheme] = useState<string | null>("dark");

  useEffect(() => {
    const storedTheme = getLocalStorageValue("vite-ui-theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

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
      setLocalCode(value);
    }
  };

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  return (
    <div className="flex flex-col w-full h-full rounded-lg border shadow-lg overflow-hidden">
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
