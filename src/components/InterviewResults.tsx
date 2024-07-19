import React from 'react';

const InterviewResults: React.FC<{ results: any }> = ({ results }) => {
  return (
    <div>
      <h2>Interview Feedback</h2>
      <p>{results.feedback}</p>
      <audio controls>
        <source src={`data:audio/wav;base64,${results.audio}`} type="audio/wav" />
      </audio>
    </div>
  );
};

export default InterviewResults;
