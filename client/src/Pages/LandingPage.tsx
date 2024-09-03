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
import { MapPin, Search } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/Aceternity/container-scroll-animation";
import { Badge } from "@/components/ui/badge";
import SwipeButton from "@/components/ui/Animata/swipeButton";

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
        <main className="flex items-center justify-center">
          <div className="mt-14 h-screen w-full dark:bg-background bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <section className="w-full max-w-7xl py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-4 my-12">
                    <div className="inline-block px-3 py-1 text-sm">
                      <Badge variant="secondary" className="font-light ">
                        Beta access
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                      Elevate Your Coding Interview Prep
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Our AI-powered platform provides personalized guidance and
                      practice to help you ace your next coding interview.
                    </p>
                  </div>
                  <SwipeButton
                    onClick={() => {
                      navigate("/explore", {
                        state: { Key: "/explore" },
                      });
                    }}
                    firstText="Get Started"
                    secondText="Explore"
                    firstClass=" font-light bg-background"
                    secondClass="font-light bg-background"
                  />
                </div>
              </div>
              <FeaturesSection />
            </section>
          </div>
        </main>
      </div>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} AI Coding Interview. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6"></nav>
      </footer>
    </>
  );
}
