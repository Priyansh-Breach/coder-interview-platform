import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRegisterMutation } from "@/redux/features/Auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SignUpuserSchema from "./Form Schema/SignUpFormSchema";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoadingIcon } from "../ui/Icons/SelectMore";

interface Props {
  setVerifyEmail: any;
}

export function SignUpComponent(props: Props) {
  const form = useForm<z.infer<typeof SignUpuserSchema>>({
    resolver: zodResolver(SignUpuserSchema),
    defaultValues: {
      FirstName: "",
      LastName: "",
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const [register, { isError, isSuccess, error, data, isLoading }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "OTP Sent!",
        description: `${data?.message}`,
      });
      props.setVerifyEmail(true);
    }

    if (error) {
      if ("data" in error) {
        const err = error as any;
        toast({
          title: `${err?.data?.message}`,
          description: `${err?.status}`,
        });
      }
    }
  }, [isSuccess, isError]);

  async function onSubmit(values: z.infer<typeof SignUpuserSchema>) {
    console.log(values);
    const name: string = `${values.FirstName} ${values.LastName}`;
    const email: any = `${values.email}`;
    const password: any = `${values.password}`;

    const data = {
      name,
      email,
      password,
    };

    await register(data);
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="FirstName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                          id="first-name"
                          placeholder="Max"
                          {...field}
                          required
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LastName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                          id="last-name"
                          placeholder="Robinson"
                          {...field}
                          required
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...field}
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
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" {...field} type="password" />
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
                  <>{"Create an account"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
        <Button variant="outline" className="w-full mt-2">
          Sign up with GitHub
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Log in
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
