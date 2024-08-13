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
import { useLoadUserQuery } from "@/redux/features/Api/apiSlice";
import PrivateRoute from "./components/PrivateRoute";
import { initializeAppAsync, refreshTokenFunc } from "@/redux/store";
import { useEffect } from "react";

function App() {
  const { isLoading, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    initializeAppAsync().then(() => {
      console.log("App initialized successfully");
    });

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
            {/**Protected Routes */}
            <Route
              path="/interview/:id"
              element={
                <PrivateRoute
                  route={"/login"}
                  loading={isLoading}
                  userRole={data?.user?.role?.toString()}
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
                  loading={isLoading}
                  userRole={data?.user?.role?.toString()}
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
