import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import { useGiveFeedbackMutation } from "@/redux/features/Feedback/feedbackApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { LoadingIcon } from "./ui/Icons/SelectMore";
import { useSelector } from "react-redux";
const emojis = [
  { feeling: "Very Negative", emoji: "😭" },
  { feeling: "Negative", emoji: "😔" },
  { feeling: "Neutral", emoji: "😐" },
  { feeling: "Positive", emoji: "🙂" },
  { feeling: "Very Positive", emoji: "😄" },
];

const feedbackSchema = z.object({
  feedbackText: z
    .string(),
  rating: z.string(),
  userId: z.string().optional(),
});

const COOLDOWN_PERIOD = 3600000; // 1 hour

export const FeedbackForm = () => {
  const [feedback, { isLoading, isSuccess, isError, error, data }] =
    useGiveFeedbackMutation();
  const { user } = useSelector((state: any) => state.auth);
  const [selectedEmoji, setSelectedEmoji] = useState(2);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedbackText: "",
      rating: "Neutral",
      userId: "",
    },
  });

  const { toast } = useToast();
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const lastFeedbackTime = localStorage.getItem("time");
    if (lastFeedbackTime) {
      const timeElapsed = Date.now() - parseInt(lastFeedbackTime, 10);
      if (timeElapsed < COOLDOWN_PERIOD) {
        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
        }, COOLDOWN_PERIOD - timeElapsed);
      }
    }
  }, []);

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    const feedbackText: string = values.feedbackText;
    const userId: any = user && user?._id;
    const rating: string = values.rating;
   
    await feedback({ feedbackText, rating, userId });

    // Start cooldown and save timestamp
    const timestamp = Date.now();
    localStorage.setItem("time", timestamp.toString());
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, COOLDOWN_PERIOD);
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: `${data.message}`,
      });
    }

    if (error) {
      if ("data" in error) {
        const err = error as any;
        toast({
          title: `${err?.status}`,
          description: `${err?.data?.message}`,
        });
      }
    }
  }, [isSuccess, isError]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="sm:flex sm:justify-center">
            <div className="relative  rounded-full px-3 text-sm leading-6 ring-1 ring-green-900 hover:ring-green-900/20">
              <a
                href="#"
                className="text-foreground font-light transition-colors hover:text-foreground"
              >
                feedback
              </a>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="m-4 z-[200] ml-16 border-none ring-1 transition ring-green-900 hover:ring-green-900/20 rounded-xl">
          <Card className="w-full max-w-md mx-auto border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {!cooldown && (
                <>
                  <CardTitle className="text-sm font-medium">
                    Feedback
                  </CardTitle>
                </>
              )}
            </CardHeader>
            <CardContent>
              {!cooldown && (
                <>
                  <h2 className="text-2xl font-bold text-center mb-2">
                    How are you feeling?
                  </h2>
                  <p className="text-sm text-center text-muted-foreground mb-6">
                    Your input is valuable in helping us better understand your
                    needs and tailor our service accordingly.
                  </p>
                </>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  {!cooldown && (
                    <>
                      <FormField
                        control={form.control}
                        name="feedbackText"
                        render={({ field }) => (
                          <FormItem>
                            <Textarea
                              placeholder="Type your feedback here..."
                              className="p-4 min-h-[150px]"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-center space-x-4 mb-6">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className={`text-3xl ${
                                    selectedEmoji === index
                                      ? "bg-primary/20 rounded-full p-2"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedEmoji(index);
                                    field.onChange(emojis[index].feeling);
                                  }}
                                >
                                  {emoji.emoji}
                                </button>
                              ))}
                            </div>
                            {selectedEmoji !== null && (
                              <div className="text-center mb-4">
                                <span className="bg-primary/20 text-primary text-sm font-medium px-2 py-1 rounded-full">
                                  {emojis[selectedEmoji].feeling}
                                </span>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={cooldown || isLoading}>
                        {isLoading ? (
                          <>
                            <LoadingIcon />
                          </>
                        ) : (
                          <>{"Submit Now"}</>
                        )}
                      </Button>
                    </>
                  )}
                  {cooldown && (
                    <p className="text-red-500 text-sm mt-2">
                      feedback recorded :)
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
