import { LoginComponent } from "@/components/Authentication/LoginComponent";
import { MetaData } from "@/lib/MetaData/metaData";

const LoginPage: React.FC<any> = () => {
  return (
    <>
      <MetaData
        title="Login - Coder Interview"
        description="Log in to access our innovative platform where you can give interviews and solve coding problems simultaneously. Enhance your skills with real-time coding challenges and comprehensive interview practice. Prepare for your dream job with our AI-powered educational resources and expert guidance."
        keywords="login, interview platform, coding interview, real-time coding, coding challenges, interview practice, AI-powered education, job preparation, educational resources"
      />
      <div className="flex items-center justify-center min-h-screen">
        <LoginComponent />
      </div>
    </>
  );
};

export default LoginPage;
