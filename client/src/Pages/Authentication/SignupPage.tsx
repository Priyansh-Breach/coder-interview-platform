import { SignUpComponent } from "@/components/Authentication/SignupComponent";
import { MetaData } from "@/lib/MetaData/metaData";

const SignupPage: React.FC<any> = () => {
  return (
    <>
      <MetaData
        title="Sign Up - Coder Interview"
        description="Create an account to access our innovative platform where you can give interviews and solve coding problems simultaneously. Enhance your skills with real-time coding challenges and comprehensive interview practice. Prepare for your dream job with our AI-powered educational resources and expert guidance."
        keywords="sign up, registration, interview platform, coding interview, real-time coding, coding challenges, interview practice, AI-powered education, job preparation, educational resources"
      />

      <div className="flex items-center justify-center min-h-screen">
        <SignUpComponent />
      </div>
    </>
  );
};

export default SignupPage;
