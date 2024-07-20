// src/components/QuestionScreen.tsx
import React from "react";

interface QuestionScreenProps {
  question: string;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ question }) => {
  return (
    <div>
      <h2>Question:</h2>
      <p>{question}</p>
    </div>
  );
};

export default QuestionScreen;
