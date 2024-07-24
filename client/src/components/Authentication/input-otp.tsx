import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useActivationMutation } from "@/redux/features/Auth/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { LoadingIcon } from "../ui/Icons/SelectMore";

export function InputOtp() {
  const [value, setValue] = React.useState("");

  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isError, isSuccess, error, data, isLoading }] =
    useActivationMutation();
  const navigate = useNavigate();

  const { toast } = useToast();
  const [invalidOtp, setInvalidOtp] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: `${data?.message}`,
        description: `Login with you account.`,
      });
      navigate("/login");
    }

    if (error) {
      if ("data" in error) {
        toast({
          title: `${error?.data?.message}`,
        });
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  }, [isSuccess, isError]);

  const verificationHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (value.length < 6) {
      setInvalidOtp(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="max-w-md w-full space-y-4 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Enter OTP</h1>
          <p className="text-muted-foreground">
            Please enter the 6-digit one-time password sent to your phone.
          </p>
        </div>
        <form className="space-y-4" onSubmit={verificationHandler}>
          <div className="flex items-center justify-center gap-2">
            <InputOTP maxLength={6} onChange={(value) => setValue(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" className="w-full">
            {isLoading ? (
              <>
                <LoadingIcon />
              </>
            ) : (
              <>({"Verify OTP"})</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
