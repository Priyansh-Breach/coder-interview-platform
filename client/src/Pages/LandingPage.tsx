import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetaData } from "@/lib/MetaData/metaData";
import AutoTypingEditor from "@/components/AutoTypingEditor";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { FeaturesSection } from "@/components/ui/featureSection";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FlipWords } from "@/components/ui/flip-words";
import DuolingoButton from "@/components/ui/Animata/duolingo";

function CardHoverEffect() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={companies} />
    </div>
  );
}
export const companies = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];

const words = ["interview", "challenge", "question", "skill"];

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
                    <h1 className="text-3xl mt-[5rem]  font-bold  sm:text-5xl xl:text-6xl/none">
                      <div className=" flex  ">
                        <div className="text-4xl font-bold ">
                          {" "}
                          Ace Your Next Coding <FlipWords words={words} />{" "}
                          <br />
                        </div>
                      </div>
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
                      
                    >
                      <DuolingoButton
                        title="Get Started"
                        handleSubmit={() => {}}
                        isLoading={false}
                      />
                    </a>
                  </div>
                </div>
                <div>
                  <AutoTypingEditor />
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    key feartures
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Elevate Your Coding Interview Prep
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI-powered platform provides personalized guidance and
                    practice to help you ace your next coding interview.
                  </p>
                </div>
                <FeaturesSection />
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
                    What companies need in a candidate
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Hear from real people who have used our platform to land
                    their dream jobs.
                  </p>
                </div>
                <CardHoverEffect />
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
