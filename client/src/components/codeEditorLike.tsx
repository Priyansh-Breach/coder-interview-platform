import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { getLocalStorageValue } from "@/lib/Utils/getLocalStorage";
import { useEffect, useState } from "react";

const CodeEditorLike = ({ code, language }: any) => {
  const [theme, setTheme] = useState<string | null>("dark");

  useEffect(() => {
    const storedTheme = getLocalStorageValue("vite-ui-theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);
  return (
    <div className="editor-container rounded-md border-[1px] dark:border-[#1e1e1e] dark:shadow-lg ">
      <div className="editor-header bg-muted  dark:text-gray-300   p-2 rounded-t-md flex justify-between items-center">
        <span className="font-mono text-xs">{language}</span>
        <div className="flex space-x-2">
          <span className="editor-dot bg-red-500 rounded-full w-3 h-3"></span>
          <span className="editor-dot bg-yellow-500 rounded-full w-3 h-3"></span>
          <span className="editor-dot bg-green-500 rounded-full w-3 h-3"></span>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vs2015}
        customStyle={{
          padding: "1rem",
          fontSize: "0.875rem",
          borderRadius: " 0 0 0.375rem 0.375rem",
          backgroundColor: `${theme === "light" ? "#fff" : "#1e1e1e"} `,
          height: "auto",
          width: "auto",
          overflowX: "auto",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeEditorLike;
