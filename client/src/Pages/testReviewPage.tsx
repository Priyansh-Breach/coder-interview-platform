import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ClockIcon } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-xl font-semibold">Frontend Developer with Theresa Webb</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">2:03/56:00</span>
          </div>
          <Button variant="outline">Finish Interview</Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white p-4 overflow-y-auto border-r">
          <h2 className="font-semibold mb-2">Questions</h2>
          <p className="text-sm text-gray-500 mb-4">1/6 Completed</p>
          {["Warmup", "Tell me about a time when you had to lead a group to achieve a specific outcome.", "Describe a time when you created a strategy to achieve a long-term organizational objective.", "How do your personal goals and objectives link to your company's strategic plan?", "How do you react when faced with constant time pressure? Give an example.", "Cooldown"].map((question, index) => (
            <Card key={index} className="p-3 mb-3">
              <h3 className="font-medium">{question}</h3>
              <p className="text-sm text-gray-500">{[5, 7, 9, 5, 7, 5][index]} minutes</p>
            </Card>
          ))}
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6">
            Tell me about a time when you had to lead a group to achieve a specific outcome.
          </h2>
          <div className="flex space-x-4 mb-6">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={rating === 4 ? "default" : "outline"}
                className="w-12 h-12 rounded-full"
              >
                {rating}
              </Button>
            ))}
          </div>
          <Textarea className="w-full mb-4" placeholder="Note" rows={4} />
          <div className="flex justify-between items-center">
            <Button variant="default">Continue</Button>
            <div className="text-sm text-gray-500">
              or press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⏎</kbd>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}