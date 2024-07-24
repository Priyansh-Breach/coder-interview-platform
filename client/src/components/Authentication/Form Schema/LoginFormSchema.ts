import { z } from "zod";

// Define the schema for the form
const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export default LoginFormSchema;
