import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./lib/ErrorBoundary";
import { InterviewPage, LandingPage, LoginPage, SignupPage } from "./Routes";
import { useLoadUserQuery } from "@/redux/features/Api/apiSlice";

function App() {
  const { isLoading, isError, data } = useLoadUserQuery(undefined, {});

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />

          {/**Protected Routes */}
          <Route path="/interview" element={<InterviewPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
