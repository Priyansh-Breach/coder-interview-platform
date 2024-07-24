import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./lib/ErrorBoundary";
import {
  InterviewPage,
  LandingPage,
  LoginPage,
  SignupPage,
  NotFound404Page,
} from "./Routes";
import { useLoadUserQuery } from "@/redux/features/Api/apiSlice";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { isLoading, data } = useLoadUserQuery(undefined, {});

  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />

            {/**Protected Routes */}
            <Route
              path="/interview"
              element={
                <PrivateRoute
                  route={"/login"}
                  loading={isLoading}
                  userRole={data?.user?.role?.toString()}
                  allowedRoles={["user", "admin"]}
                  path={"/interview"}
                >
                  <InterviewPage />
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
