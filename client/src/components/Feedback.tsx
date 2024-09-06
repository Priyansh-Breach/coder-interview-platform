import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";
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

const feedbackSchema = z.object({
  feedbackText: z
    .string()
    .min(10, "Feedback must be at least 10 characters long."),
  rating: z
    .number()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5."),
  userId: z.string().optional(),
});

const COOLDOWN_PERIOD = 30000; // 30 seconds

export const FeedbackForm = () => {
  const [feedback, { isLoading, isSuccess, isError, error, data }] =
    useGiveFeedbackMutation();
  const { user } = useSelector((state: any) => state.auth);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedbackText: "",
      rating: 0,
      userId: "",
    },
  });

  const { toast } = useToast();
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const lastFeedbackTime = localStorage.getItem("lastFeedbackTime");
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
    const rating: number = values.rating;
    await feedback({ feedbackText, rating, userId });

    // Start cooldown and save timestamp
    const timestamp = Date.now();
    localStorage.setItem("lastFeedbackTime", timestamp.toString());
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
          <Card className="w-sm max-w-md p-6 grid gap-6 border-none  ">
            <div className="grid gap-2">
              <CardTitle className="text-xl font-semibold">Feedback</CardTitle>
              <CardDescription className="text-muted-foreground">
                We'd love to hear your thoughts.
              </CardDescription>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
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
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 cursor-pointer ${
                              field.value >= star
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            onClick={() => field.onChange(star)}
                          />
                        ))}
                      </div>
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
                    <>{"Submit Feedback"}</>
                  )}
                </Button>
                {cooldown && (
                  <p className="text-red-500 text-sm mt-2">
                    You can submit feedback again in 30 seconds.
                  </p>
                )}
              </form>
            </Form>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
