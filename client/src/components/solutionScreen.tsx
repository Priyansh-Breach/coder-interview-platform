import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DOMPurify from "dompurify";
import { convertMarkdownToHtml } from "./QuestionScreen";
import { Badge } from "./ui/Aceternity/expandable-card-standard";
import { languages } from "monaco-editor";

// Function to format a single code snippet and its explanation
const formatCodeAndExplanation = (code: string, explanation?: string) => {
  const codeHtml = DOMPurify.sanitize(convertMarkdownToHtml(code || ""));
  const explanationHtml = explanation
    ? `<div class="mt-4 p-4 border border rounded bg-[#eff1f6bf] overflow-auto dark:bg-[#f7faff1f]">
          <strong class="text-lg">Explanation:</strong><br>
          ${DOMPurify.sanitize(convertMarkdownToHtml(explanation || ""))}
        </div>`
    : "";

  return `
      <div class="mb-6">
        <pre class="p-2 px-6 overflow-auto bg-[#eff1f6bf] dark:bg-[#f7faff1f] rounded">
          <code>${codeHtml}</code>
        </pre>
        ${explanationHtml}
      </div>
    `;
};

const formatAnswerToHtml = (answer: any) => {
  // Ensure answer is an array
  const answerArray = Array.isArray(answer) ? answer : [answer];

  // Generate HTML for each entry in the answer array
  return answerArray
    .map((entry: { [key: string]: string }) => {
      // Extract code and explanation from the entry
      const languages = Object.keys(entry);
      const mainContent = languages
        .map((language) => {
          if (language !== "explanation") {
            return `
            <div class="mb-4">
              <h2 class="text-xl font-semibold mb-2">${
                language.charAt(0).toUpperCase() + language.slice(1)
              } Code:</h2>
              ${formatCodeAndExplanation(entry[language])}
            </div>
          `;
          } else {
            return formatCodeAndExplanation("", entry[language]);
          }
        })
        .join("");

      return mainContent;
    })
    .join("");
};

export const SolutionScreen = () => {
  const Data = useSelector((state: RootState) => state.editor.questionData);

  if (!Data?.data) {
    return <div>No question data available</div>;
  }

  // Sanitize and convert content to HTML
  const sanitizedContent = DOMPurify.sanitize(
    convertMarkdownToHtml(Data?.data?.content || "")
  );

  // Process the answer object to generate HTML
  const formattedAnswer = Data?.data?.answer
    ? formatAnswerToHtml(Data?.data?.answer)
    : "";

  return (
    <div className="p-6 ">
      <div className="max-w-3xl mx-auto">
        <section>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: formattedAnswer }}
          />
        </section>
      </div>
    </div>
  );
};
