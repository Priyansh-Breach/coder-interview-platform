import React from 'react';
import InterviewForm from './components/InterviewForm';
import InterviewResults from './components/InterviewResults';

const App: React.FC = () => {
  const [results, setResults] = React.useState<any>(null);

  return (
    <div>
      <h1>Coder Interview Platform</h1>
      <InterviewForm setResults={setResults} />
      {results && <InterviewResults results={results} />}
    </div>
  );
};

export default App;
