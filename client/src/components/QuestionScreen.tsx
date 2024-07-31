import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DOMPurify from "dompurify";
import { Badge } from "./ui/Aceternity/expandable-card-standard";

export const convertMarkdownToHtml = (text: string): string => {
  // Escape backslashes and square brackets
  let html = text
    .replace(/\\/g, '&#92;') // Escape backslashes
    .replace(/\[/g, '&#91;') // Escape opening square brackets
    .replace(/\]/g, '&#93;') // Escape closing square brackets
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
    .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italics
    .replace(/^\s*\*\s/gm, '<li>') // List items
    .replace(/\n/g, '<br>'); // Line breaks

  // Wrap list items in ul
  html = html.replace(/(<li>.*?<\/li>)(?!<\/ul>)/g, '<ul>$1</ul>');

  return html;
};


export default function Component() {
  const Data = useSelector((state: RootState) => state.editor.questionData);

  if (!Data?.data) {
    return <div>No question data available</div>;
  }

  // Sanitize and convert content to HTML
  const sanitizedContent = DOMPurify.sanitize(
    convertMarkdownToHtml(Data?.data?.content || "")
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="border-b border-gray-700 pb-4 mb-4">
          <h1 className="text-2xl font-bold">{Data?.data?.title}</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge difficulty={Data?.data?.difficulty || "NaN"} />
          </div>
        </header>
        <section>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </section>
      </div>
    </div>
  );
}
