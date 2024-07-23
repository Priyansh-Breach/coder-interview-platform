import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./lib/ErrorBoundary";
import { InterviewPage, LandingPage, LoginPage,SignupPage } from "./Routes";


function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            
            {/**Protected Routes */}
            <Route path="/interview" element={<InterviewPage />} />
            
          </Routes>
        </ErrorBoundary>
      </Router>
    </>
  )
}

export default App
