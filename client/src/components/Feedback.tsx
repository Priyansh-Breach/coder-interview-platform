import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";

export const FeedbackForm = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className=" sm:flex sm:justify-center">
            <div className="relative shadow-gradient-green rounded-full px-3  text-sm leading-6  ring-1 ring-gray-900 hover:ring-gray-900/20">
              <a
                href="#"
                className="text-foreground font-light transition-colors hover:text-foreground"
              >
                feedback
              </a>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="m-4 ml-16 rounded-xl">
          <Card className="w-sm max-w-md p-6 grid gap-6">
            <div className="grid gap-2">
              <CardTitle className="text-xl font-semibold">Feedback</CardTitle>
              <CardDescription className="text-muted-foreground">
                We'd love to hear your thoughts.
              </CardDescription>
            </div>
            <form className="grid gap-4">
              <Textarea
                placeholder="Type your feedback here..."
                className="p-4 min-h-[150px]"
              />
              <Button type="submit">Submit Feedback</Button>
            </form>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
