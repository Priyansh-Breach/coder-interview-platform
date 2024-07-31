import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/features/Auth/authApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import LoginFormSchema from "./Form Schema/LoginFormSchema";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoadingIcon } from "../ui/Icons/SelectMore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const LoginComponent: React.FC<any> = () => {
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    const email: string = values.email;
    const password: string = values.password;

    await login({ email, password });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: `Login success`,
      });
      navigate("/explore");
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
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                          required
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {isLoading ? (
                    <>
                      <LoadingIcon />
                    </>
                  ) : (
                    <>{"Login"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <Button variant="outline" className="w-full mt-3">
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
