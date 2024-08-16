import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./lib/ErrorBoundary";
import {
  InterviewPage,
  LandingPage,
  LoginPage,
  SignupPage,
  NotFound404Page,
  ExplorePage,
  InterviewQuestionContextPage,
} from "./Routes";
import PrivateRoute from "./components/PrivateRoute";
import { initializeAppAsync, refreshTokenFunc } from "@/redux/store";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeAppAsync();
        console.log("App initialized successfully");
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
    };

    initializeApp();

    const refreshToken = setInterval(() => {
      refreshTokenFunc();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshToken);
  }, []);

  

  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            {/** Protected Routes */}
            <Route
              path="/interview/:id"
              element={
                <PrivateRoute
                  route={"/login"}
                  allowedRoles={["user", "admin"]}
                  path={"/interview/:id"}
                >
                  <InterviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/question-context/:id"
              element={
                <PrivateRoute
                  route={"/login"}
                  allowedRoles={["user", "admin"]}
                  path={"/interview/question-context/:id"}
                >
                  <InterviewQuestionContextPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound404Page />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </>
  );
}

export default App;
