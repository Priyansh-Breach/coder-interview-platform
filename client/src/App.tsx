
import { ModeToggle } from "@/components/mode-toggle"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./lib/ErrorBoundary";
import { InterviewPage,LandingPage } from "./Routes";


function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<LandingPage />} />
            <Route path="/interview" element={<InterviewPage />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </>
  )
}

export default App
