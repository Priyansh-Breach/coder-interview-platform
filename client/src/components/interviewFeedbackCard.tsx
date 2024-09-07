import ScoreBoard from "./ui/Animata/gauge-chart";
import GaugeChart from "./ui/Animata/gauge-chart";
import MobileDetail from "./ui/Animata/mobile-detail";
import Profile from "./ui/Animata/profile";
import SwapTextCard from "./ui/Animata/swap-text-card";
import { Card, CardContent } from "./ui/card";

export default function ModernInterviewFeedback() {
  const interviewData = {
    candidateName: "John Doe",
    position: "Software Engineer",
    interviewDate: "2023-06-15",
    interviewDuration: "1 hour",
    overallRating: 4,
    overallScore: 85,
    hired: true,
    feedbackCategories: [
      { name: "Technical Skills", rating: "Good", score: 75 },
      { name: "Communication", rating: "Excellent", score: 90 },
      { name: "Problem Solving", rating: "Good", score: 80 },
      { name: "Cultural Fit", rating: "Excellent", score: 95 },
    ],
    areasForImprovement: [
      "Deepen knowledge in system design principles",
      "Gain more experience with cloud technologies",
      "Practice more complex algorithm problems",
    ],
    additionalComments:
      "John demonstrated strong technical skills and excellent communication. He approached problem-solving methodically and showed great potential for growth. His values align well with our company culture.",
    chatFeedback: [
      {
        question:
          "Can you explain the difference between let, const, and var in JavaScript?",
        answer:
          "I explained that let and const were introduced in ES6, with let being block-scoped and reassignable, const being block-scoped but not reassignable, and var being function-scoped and hoisted.",
        feedback:
          "Excellent explanation. Candidate showed a deep understanding of JavaScript fundamentals.",
        rating: 5,
      },
      {
        question:
          "How would you optimize the performance of a React application?",
        answer:
          "I discussed using React.memo for functional components, useCallback for memoizing functions, and useMemo for expensive computations. I also mentioned code splitting and lazy loading for larger applications.",
        feedback:
          "Good answer, but could have mentioned more about profiling and identifying bottlenecks.",
        rating: 4,
      },
      {
        question:
          "Describe a challenging project you've worked on and how you overcame obstacles.",
        answer:
          "I described a project where we had to migrate a large legacy system to a modern stack, detailing the planning process, the challenges we faced with data migration, and how we implemented the change in phases to minimize disruption.",
        feedback:
          "Strong response showing good project management and problem-solving skills.",
        rating: 5,
      },
    ],
  };

  return (
    <div className="min-h-fit py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Areas for Improvement Card */}
        {/* <Card className="shadow-lg overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-semibold">
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {interviewData.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start p-3 rounded-lg">
                  <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

export const HiredWithFeedback = () => {
  return (
    <>
      <SwapTextCard
        finalText="Animata is developed by a passionate team of developers who love animations. We study the best interactions from top websites and bring them to you, saving you hours of development time."
        initialText="Hand-crafted ✍️ interaction animation on internet"
      />
    </>
  );
};

export const ProfileCard = () => {
  return (
    <>
      <Profile />
    </>
  );
};

export const FeedbackFields = () => {
  return (
    <div>
      <MobileDetail />
    </div>
  );
};

export const ScoreCard = () => {
  return (
    <>
      <ScoreBoard
        items={[
          {
            className: "rounded-md bg-green-500",
            label: "A",
            progress: 34,
          },
          {
            className: "rounded-md bg-red-500",
            label: "B",
            progress: 14,
          },
          {
            className: "rounded-md bg-green-500",
            label: "C",
            progress: 34,
          },
          {
            className: "rounded-md bg-green-500",
            label: "D",
            progress: 70,
          },
          {
            className: "rounded-md bg-green-500",
            label: "E",
            progress: 52,
          },
          {
            className: "rounded-md bg-green-500",
            label: "F",
            progress: 30,
          },
          {
            className: "rounded-md bg-green-500",
            label: "G",
            progress: 37,
          },
          {
            className: "rounded-md bg-green-500",
            label: "H",
            progress: 72,
          },
          {
            className: "rounded-md bg-green-500",
            label: "I",
            progress: 42,
          },
        ]}
      />
    </>
  );
};
