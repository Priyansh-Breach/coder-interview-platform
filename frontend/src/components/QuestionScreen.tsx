import React from "react";

interface QuestionScreenProps {
    question: string;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ question }) => {
    return (
        <div>
            <h1>{question}</h1>
        </div>
    );
};

export default QuestionScreen;
