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
import {
  setCode,
  setLanguage,
  updateSendCode,
} from "@/redux/features/Interview/editorSlice";
import { debounce } from "lodash";
import { Switch } from "@/components/ui/switch";
import { Label } from "./ui/label";

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

const MonacoEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.editor.code);
  const sendCodeState = useAppSelector((state) => state.editor.sendCode);
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

  const handleToggle = () => {
    dispatch(updateSendCode(!sendCodeState));
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
        <div className="flex items-center mr-16 space-x-2">
          <Switch
            id="send-code-mode"
            checked={sendCodeState}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="send-code-mode">code editor is {sendCodeState ? "on" : "off"}</Label>
        </div>
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
