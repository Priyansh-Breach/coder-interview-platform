// frontend/src/App.tsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import ErrorBoundary from "./ErrorBoundary"; // Import the ErrorBoundary component

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
