import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BadgeIcon,
  CodeIcon,
  ReplyIcon,
} from "@/components/ui/Icons/SelectMore";
import { MetaData } from "@/lib/MetaData/metaData";
import AutoTypingEditor from "@/components/AutoTypingEditor";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Key } from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  return (
    <>
      <MetaData
        title="Coder Interview"
        description="Join our innovative platform where you can give interviews and solve coding problems simultaneously. Enhance your skills with real-time coding challenges and comprehensive interview practice. Prepare for your dream job with our AI-powered educational resources and expert guidance."
        keywords="interview platform, coding interview, real-time coding, coding challenges, interview practice, AI-powered education, job preparation, educational resources"
      />
      <div className="flex flex-col min-h-[100dvh]">
        <Navbar />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Ace Your Next Coding Interview
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Prepare for your coding interview with our AI-powered
                      platform. Get personalized feedback, practice questions,
                      and expert guidance to land your dream job.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <a
                      onClick={() => {
                        navigate("/explore", {
                          state: { Key: "/explore" },
                        });
                      }}
                      href="#"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
                <div>
                  <AutoTypingEditor />
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 ">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg  px-3 py-1 text-sm">
                    Key Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Elevate Your Coding Interview Prep
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI-powered platform provides personalized guidance and
                    practice to help you ace your next coding interview.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <CodeIcon className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-bold">Personalized Practice</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get tailored practice questions based on your skill level
                    and interview needs.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <ReplyIcon className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-bold">Instant Feedback</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Receive real-time feedback on your code and performance to
                    improve quickly.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <BadgeIcon className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-bold">Expert Guidance</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get personalized advice from experienced interviewers to
                    refine your skills.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    Testimonials
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    What Our Users Say
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Hear from real people who have used our platform to land
                    their dream jobs.
                  </p>
                </div>
                <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <Card className="flex flex-col gap-4 p-6 bg-background shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">John Doe</h4>
                        <p className="text-sm text-muted-foreground">
                          Software Engineer
                        </p>
                      </div>
                    </div>
                    <blockquote className="flex-1">
                      <p className="text-muted-foreground">
                        "The AI-powered practice questions and feedback helped
                        me\n identify and improve my weak areas. I landed my
                        dream\n job at a top tech company!"
                      </p>
                    </blockquote>
                  </Card>
                  <Card className="flex flex-col gap-4 p-6 bg-background shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          Sarah Anderson
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Software Developer
                        </p>
                      </div>
                    </div>
                    <blockquote className="flex-1">
                      <p className="text-muted-foreground">
                        "I was struggling to prepare for my coding interview\n
                        until I found this platform. The expert guidance and\n
                        personalized practice were invaluable."
                      </p>
                    </blockquote>
                  </Card>
                  <Card className="flex flex-col gap-4 p-6 bg-background shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          Michael Reeves
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Software Engineer
                        </p>
                      </div>
                    </div>
                    <blockquote className="flex-1">
                      <p className="text-muted-foreground">
                        "This platform is a game-changer for coding interview\n
                        preparation. The instant feedback and adaptive
                        practice\n questions helped me ace my interviews."
                      </p>
                    </blockquote>
                  </Card>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 ">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Elevate Your Coding Interview Prep?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up now and start practicing with our AI-powered platform.
                  Get personalized feedback and expert guidance to land your
                  dream job.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1"
                  />
                  <Button type="submit">Get Started</Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Sign up to start your coding interview prep journey.{" "}
                  <a href="#" className="underline underline-offset-2">
                    Terms &amp; Conditions
                  </a>
                </p>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} AI Coding Interview. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6"></nav>
        </footer>
      </div>
    </>
  );
}
